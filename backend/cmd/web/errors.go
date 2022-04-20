package main

import (
	"errors"
	"net/http"
)

var ErrNoSearchQuery = errors.New("the url must provide either a last name, email or ID")


func (app *application) logError(r *http.Request, err error) {
	app.errorLog.Println(err)
}
func (app *application) errorResponse(w http.ResponseWriter, r *http.Request, status int, message interface{}) {
	env := envelope{
		"error": message,
	}
	err := app.writeJSON(w, status, env, nil)
	if err != nil {
		app.logError(r, err)
		w.WriteHeader(500)
	}
}
func (app *application) serverErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.logError(r, err)

	message := "the server encountered a problem and could not process your request"
	app.errorResponse(w, r, http.StatusInternalServerError, message)
}
func (app *application) notFoundResponse(w http.ResponseWriter, r *http.Request) {
	message := "the requested resource could not be found"
	app.errorResponse(w, r, http.StatusNotFound, message)
}

func (app *application) badRequestResponse(w http.ResponseWriter, r *http.Request, err error) {
	app.errorResponse(w, r, http.StatusBadRequest, err.Error())
}
func (app *application) failedValidationResponse(w http.ResponseWriter, r *http.Request, errors map[string]string) {
	app.errorResponse(w, r, http.StatusUnprocessableEntity, errors)
}
func (app *application) unauthenticadedResponse(w http.ResponseWriter, r *http.Request) {
	app.errorLog.Print("you are apparently not logged in!")
	message := "you have to be logged in to continue"
	app.errorResponse(w, r, http.StatusUnauthorized, message)
}
