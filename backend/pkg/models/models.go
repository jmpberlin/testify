package models

import (
	"errors"
	"time"
)

var (
	ErrNoRecord            = errors.New("no matching record found")
	ErrInvalidCredentials  = errors.New("invalid credentials")
	ErrDuplicateEmail      = errors.New("email already in use")
	ErrTimeslotUnavailable = errors.New("timeslot is already taken")
)

type Snippet struct {
	ID      int
	Title   string
	Content string
	Created time.Time
	Expires time.Time
}
type Appointment struct {
	ID           int       `json:"id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Email        string    `json:"email"`
	Duration     int       `json:"duration"`
	Service      string    `json:"service"`
	Result       bool      `json:"result"`
	AddressName  string    `json:"address_name"`
	StreetName   string    `json:"street_name"`
	StreetNumber string    `json:"street_number"`
	ZipCode      string    `json:"zip_code"`
	City         string    `json:"city"`
	Country      string    `json:"country"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	TimeSlot     int       `json:"time_slot"`
}
type ResultInput struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Result    bool   `json:"result"`
}

type User struct {
	ID             int       `json:"id"`
	FirstName      string    `json:"first_name"`
	LastName       string    `json:"last_name"`
	Email          string    `json:"email"`
	HashedPassword []byte    `json:"-"`
	CreatedAt      time.Time `json:"created_at"`
	Active         bool      `json:"active"`
	Role           string    `json:"-"`
}

type TimeSlot struct {
	ID        int       `json:"id"`
	Taken     bool      `json:"taken"`
	StartTime time.Time `json:"start_time"`
}

// possibilities: employee, admin, user
