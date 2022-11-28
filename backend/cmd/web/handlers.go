package main

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"johannespolte.de/testify/pkg/models"
	"johannespolte.de/testify/pkg/models/postgres"
	"johannespolte.de/testify/pkg/validation"
)

func (app *application) signupUser(w http.ResponseWriter, r *http.Request) {

	var input struct {
		FirstName string    `json:"first_name"`
		LastName  string    `json:"last_name"`
		Email     string    `json:"email"`
		PW        string    `json:"pw"`
		CreatedAt time.Time `json:"created_at"`
	}

	user := &models.User{}

	err := DecodeJSONBody(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user.FirstName = input.FirstName
	user.LastName = input.LastName
	user.Email = strings.Trim(input.Email, " ")
	user.HashedPassword = []byte(input.PW)
	user.CreatedAt = time.Now()
	user.Active = true

	v := validation.New()
	if postgres.ValidateUser(v, user); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}
	err = app.users.Insert(user)
	if err != nil {
		if err == models.ErrDuplicateEmail {
			app.badRequestResponse(w, r, err)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/api/v1/user/%d", user.ID))
	err = app.writeJSON(w, http.StatusCreated, envelope{"user": user}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) loginUser(w http.ResponseWriter, r *http.Request) {
	// fmt.Println(app.session.Exists(r, "authenticatedUserID"))
	// fmt.Println(app.session.GetString(r, "authenticatedUserID"))
	// app.session.Put(r.Context(), "hallo", "1")

	var input struct {
		Email string `json:"email"`
		PW    string `json:"pw"`
	}
	err := DecodeJSONBody(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	id, err := app.users.Authenticate(input.Email, input.PW)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	app.session.Put(r.Context(), "authenticatedUserID", id)
	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/api/v1/users/%d", id))
	err = app.writeJSON(w, http.StatusOK, envelope{"success": "you logged in successfully!"}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
func (app *application) logoutUser(w http.ResponseWriter, r *http.Request) {
	// app.session.Remove(r, "authenticatedUserID")
	err := app.writeJSON(w, http.StatusOK, envelope{"success": "you logged out successfully!"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) createAppointment(w http.ResponseWriter, r *http.Request) {
	var input struct {
		StartTime    time.Time `json:"start_time"`
		FirstName    string    `json:"first_name"`
		LastName     string    `json:"last_name"`
		Email        string    `json:"email"`
		Duration     int       `json:"duration"`
		Service      string    `json:"service"`
		AddressName  string    `json:"address_name"`
		StreetName   string    `json:"street_name"`
		StreetNumber string    `json:"street_number"`
		ZipCode      string    `json:"zip_code"`
		City         string    `json:"city"`
		Country      string    `json:"country"`
		CreatedAt    time.Time `json:"created_at"`
		TimeSlot     int       `json:"time_slot"`
	}

	err := DecodeJSONBody(w, r, &input)
	if err != nil {
		// print potential error
		fmt.Println("there was an err in decoding the json body into the input struct", err)
		app.badRequestResponse(w, r, err)
		return
	}

	appointment := &models.Appointment{
		StartTime:    input.StartTime,
		FirstName:    input.FirstName,
		LastName:     input.LastName,
		Email:        input.Email,
		Duration:     input.Duration,
		Service:      input.Service,
		AddressName:  input.AddressName,
		StreetName:   input.StreetName,
		StreetNumber: input.StreetNumber,
		ZipCode:      input.ZipCode,
		City:         input.City,
		Country:      input.Country,
		CreatedAt:    input.CreatedAt,
		// TimeSlot:     input.TimeSlot,
	}
	err = app.appointments.IsAvailable(appointment.StartTime)
	if err != nil {
		if errors.Is(err, models.ErrTimeslotUnavailable) {
			app.errorResponse(w, r, http.StatusNotFound, "appointment is already taken")
			return
		}
		app.serverErrorResponse(w, r, err)
		return
	}
	v := validation.New()
	if postgres.ValidateAppointment(v, appointment); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.appointments.Insert(appointment)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	// app.timeslots.SetToTaken(appointment.TimeSlot)

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/api/v1/Appointment/%d", appointment.ID))
	err = app.writeJSON(w, http.StatusCreated, envelope{"appointment": appointment}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) showAppointmentsByName(w http.ResponseWriter, r *http.Request) {
	s := r.URL.Query().Get(":lastName")
	lastName := strings.Trim(s, " ")

	if lastName == "" {
		app.badRequestResponse(w, r, ErrNoSearchQuery)
		return
	}
	appointments, err := app.appointments.GetByLastName(lastName)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFoundResponse(w, r)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"appointments": appointments}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
func (app *application) showAppointmentByID(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get(":id"))

	if err != nil || id < 1 {
		app.badRequestResponse(w, r, ErrNoSearchQuery)
		return
	}
	appointment, err := app.appointments.GetByID(id)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFoundResponse(w, r)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"appointments": appointment}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showAppointmentByEmail(w http.ResponseWriter, r *http.Request) {
	e := r.URL.Query().Get(":email")
	email := strings.Trim(e, " ")

	if email == "" {
		app.badRequestResponse(w, r, ErrNoSearchQuery)
		return
	}
	appointments, err := app.appointments.GetByEmail(email)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFoundResponse(w, r)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"appointments": appointments}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) updateResult(w http.ResponseWriter, r *http.Request) {
	var input models.ResultInput

	err := DecodeJSONBody(w, r, &input)

	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	appointment, err := app.appointments.GetByID(input.ID)
	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFoundResponse(w, r)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	v := validation.New()
	postgres.ValidateResultUpdate(v, appointment, &input)
	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}
	appointment.Result = input.Result
	appointment.UpdatedAt = time.Now()

	err = app.appointments.UpdateResult(appointment)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"appointment": appointment}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

// func (app *application) showTimeslotById(w http.ResponseWriter, r *http.Request) {
// 	id, err := strconv.Atoi(r.URL.Query().Get(":id"))
// 	if err != nil || id < 1 {
// 		app.badRequestResponse(w, r, ErrNoSearchQuery)
// 		return
// 	}
// 	timeslot, err := app.timeslots.GetById(id)
// 	if err != nil {
// 		if errors.Is(err, models.ErrNoRecord) {

// 			app.errorResponse(w, r, http.StatusInternalServerError, "Please go back and make sure your timeslot is still available")
// 		} else {
// 			app.serverErrorResponse(w, r, err)
// 		}
// 		return
// 	}

// 	err = app.writeJSON(w, http.StatusOK, envelope{"timeslot": timeslot}, nil)
// 	if err != nil {
// 		app.serverErrorResponse(w, r, err)
// 	}

// }
func (app *application) getAppointmentsByDate(w http.ResponseWriter, r *http.Request) {
	date := r.URL.Query().Get(":date")
	layout := "2006-01-02T15:04:05.000Z"
	t, _ := time.Parse(layout, date)

	appointments, err := app.appointments.GetAllByDate(t)

	if err != nil {
		if errors.Is(err, models.ErrNoRecord) {
			app.notFoundResponse(w, r)
		} else {
			app.serverErrorResponse(w, r, err)
		}
		return
	}
	err = app.writeJSON(w, http.StatusOK, envelope{"appointments": appointments}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

/// DELETE -- SESSION TRYOUT

func (app *application) putSessionSnippet(w http.ResponseWriter, r *http.Request) {
	// fmt.Printf("%+v\n", app.session.Cookie)

	sessionManager.Put(r.Context(), "message", "Hello from a session!")

	// fmt.Println(w.Header())
	w.WriteHeader(200)

}

func (app *application) getSessionSnippet(w http.ResponseWriter, r *http.Request) {

	// fmt.Printf("%+v\n", app.session.Cookie)
	fmt.Println(sessionManager.GetString(r.Context(), "message"))
	io.WriteString(w, sessionManager.GetString(r.Context(), "message"))
}
