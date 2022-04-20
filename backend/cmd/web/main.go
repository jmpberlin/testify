package main

import (
	"database/sql"
	"flag"
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

type application struct {
	errorLog     *log.Logger
	infoLog      *log.Logger
	session      *scs.SessionManager
	users        *postgres.UserModel
	appointments *postgres.AppointmentModel
	timeslots    *postgres.TimeslotModel
}

var sessionManager *scs.SessionManager

func main() {
	addr := flag.String("addr", ":4000", "HTTP network address")
	dsn := flag.String("dsn", "postgres://localhost/testify?sslmode=disable", "Postgres data source name") // DSN with POSTGRES USER
	// secret := flag.String("secret", "s6Ndh+pPbnzHbS*+9Pk8qGWhTzbpa@ge", "Secret key")

	flag.Parse()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	db, err := openDB(*dsn)
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

	infoLog.Printf("Starting server on %s", *addr)

	// err = srv.ListenAndServeTLS("./tls/cert.pem", "./tls/key.pem") // GENERATE NEW CERTIFICATES!
	err = srv.ListenAndServe()
	errorLog.Fatal(err)
}

func openDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}
