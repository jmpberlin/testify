package postgres

import (
	"database/sql"
	"errors"
	"strings"
	"unicode/utf8"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"johannespolte.de/testify/pkg/models"
	"johannespolte.de/testify/pkg/validation"
)

type UserModel struct {
	DB *sql.DB
}

func ValidateUser(v *validation.Validator, user *models.User) {
	v.Check(user.FirstName != "", "first name ", "can't be blank")
	v.Check(utf8.RuneCountInString(user.FirstName) >= 2, "first name", "can't be a single character")
	v.Check(strings.Trim(user.FirstName, " ") != "", "first name", "can't only consist out of empty spaces")
	v.Check(user.LastName != "", "last name ", "can't be blank")
	v.Check(utf8.RuneCountInString(user.LastName) >= 2, "last name", "can't be a single character")
	v.Check(strings.Trim(user.LastName, " ") != "", "last name", "can't only consist out of empty spaces")
	v.Check(user.Email != "", "email ", "can't be blank")
	v.Check(utf8.RuneCountInString(user.Email) >= 2, "first name", "can't be a single character")
	v.Check(validation.Matches(user.Email, validation.EmailRX), "email address", "doesn't match a correct email format")
	v.Check(string(user.HashedPassword) != "", "password", "can't be blank")
	v.Check(len(user.HashedPassword) > 10, "password", "must have at least 10 characters")
	v.Check(strings.ToUpper(string(user.HashedPassword)) != string(user.HashedPassword), "password", "can't be all uppercase letters")
	v.Check(strings.ToLower(string(user.HashedPassword)) != string(user.HashedPassword), "password", "can't be all lowercase letters")
}
func (m *UserModel) Insert(user *models.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.HashedPassword), 12)
	if err != nil {
		return err
	}

	stmt := `INSERT INTO users (first_name,last_name,email, hashed_password,created_at)
    VALUES($1, $2, $3,$4,$5)
	RETURNING id,first_name, last_name, email`

	args := []interface{}{user.FirstName, user.LastName, user.Email, hashedPassword, user.CreatedAt}

	err = m.DB.QueryRow(stmt, args...).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email)

	if err != nil {
		var PsqlError *pq.Error
		if errors.As(err, &PsqlError) {
			if strings.Contains(PsqlError.Message, "email_unique") {
				return models.ErrDuplicateEmail
			}
		}
		return err
	}
	return nil
}

func (m *UserModel) Authenticate(email, password string) (int, error) {
	var id int
	var hashFromDB []byte
	stmt := "SELECT id, hashed_password FROM users WHERE email = $1 AND active = TRUE"
	row := m.DB.QueryRow(stmt, email)
	err := row.Scan(&id, &hashFromDB)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, models.ErrInvalidCredentials
		} else {
			return 0, err
		}
	}

	err = bcrypt.CompareHashAndPassword(hashFromDB, []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return 0, models.ErrInvalidCredentials
		} else {
			return 0, err
		}
	}

	return id, nil
}
func (m *UserModel) Get(id int) (*models.User, error) {
	return nil, nil
}
