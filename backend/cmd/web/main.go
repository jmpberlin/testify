package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/alexedwards/scs/postgresstore"
	"github.com/alexedwards/scs/v2"

	_ "github.com/lib/pq"
	"johannespolte.de/testify/pkg/models/postgres"
)

// var sessionManager *scs.SessionManager

// Question: Checkout main branch , check if everything works correctly
// Circleci branch - alle veränderungen speichern.
// test: entweder stash alle commmits, dann pull, dann wiederholen
// oder branch löschen und die veränderungen in neuem Branch wiederholen!

type application struct {
	errorLog     *log.Logger
	infoLog      *log.Logger
	session      *scs.SessionManager
	users        *postgres.UserModel
	appointments *postgres.AppointmentModel
	timeslots    *postgres.TimeslotModel
}

type config struct {
	port int
	env  string
	db   struct {
		dsn      string
		host     string
		port     int
		user     string
		password string
		dbname   string
	}
}

var sessionManager *scs.SessionManager

func main() {

	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.db.host, "DB_HOST", "localhost", "specify your db host endpoint")
	flag.StringVar(&cfg.db.user, "DB_USER", "postgres", "specify your dbs username")
	flag.StringVar(&cfg.db.password, "DB_PASSWORD", "", "specify your dbs password")
	flag.StringVar(&cfg.db.dbname, "DB_NAME", "", "specify your dbs name")
	flag.IntVar(&cfg.db.port, "DB_PORT", 5432, "specify your dbs open port")

	addr := flag.String("addr", ":4000", "HTTP network address")
	// dsn := flag.String("dsn", "postgres://localhost/testify?sslmode=disable", "Postgres data source name") // DSN with POSTGRES USER
	// secret := flag.String("secret", "s6Ndh+pPbnzHbS*+9Pk8qGWhTzbpa@ge", "Secret key")

	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	cfg.db.dsn = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		cfg.db.host, cfg.db.port, cfg.db.user, cfg.db.password, cfg.db.dbname)

	db, err := openDB(cfg)
	if err != nil {
		errorLog.Fatal(err)
	}
	defer db.Close()

	if err != nil {
		errorLog.Fatal(err)
	}
	sessionManager = scs.New()
	sessionManager.Lifetime = 5 * time.Minute
	sessionManager.Store = postgresstore.New(db)
	postgresstore.NewWithCleanupInterval(db, 1*time.Minute)
	sessionManager.IdleTimeout = 20 * time.Minute
	sessionManager.Cookie.Name = "session_id"
	sessionManager.Cookie.Persist = true
	sessionManager.Cookie.SameSite = http.SameSiteLaxMode
	// TODO: CHANGE TO TRUE IN PRODUCTION
	sessionManager.Cookie.Secure = false

	app := &application{
		errorLog:     errorLog,
		infoLog:      infoLog,
		session:      sessionManager,
		users:        &postgres.UserModel{DB: db},
		appointments: &postgres.AppointmentModel{DB: db},
		timeslots:    &postgres.TimeslotModel{DB: db},
	}

	// tlsConfig := &tls.Config{
	// 	CurvePreferences: []tls.CurveID{tls.X25519, tls.CurveP256},
	// }

	srv := &http.Server{
		Addr:     *addr,
		ErrorLog: errorLog,
		Handler:  sessionManager.LoadAndSave(app.routes()),
		// TLSConfig:    tlsConfig,
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	infoLog.Printf("Starting server on %d", cfg.port)

	// err = srv.ListenAndServeTLS("./tls/cert.pem", "./tls/key.pem") // GENERATE NEW CERTIFICATES!
	err = srv.ListenAndServe()
	errorLog.Fatal(err)
}

func openDB(cfg config) (*sql.DB, error) {

	db, err := sql.Open("postgres", cfg.db.dsn)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	return db, nil
}
