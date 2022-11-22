package main

import (
	"net/http"

	"github.com/bmizerany/pat"
	"github.com/justinas/alice"
)

func (app *application) routes() http.Handler {
	standartMiddleware := alice.New(app.enableCORS, app.logRequest) // removed the : app.recoverPanic, // app.enableCORS, ,secureHeaders
	dynamicMiddleware := alice.New()
	mux := pat.New()
	mux.Post("/api/v1/user/signup", dynamicMiddleware.ThenFunc(app.signupUser))
	mux.Post("/api/v1/user/login", dynamicMiddleware.ThenFunc(app.loginUser))
	mux.Post("/api/v1/user/logout", dynamicMiddleware.Append(app.requireAuthentication).ThenFunc(app.logoutUser)) // removed: .Append(app.requireAuthentication) - append to the dynamic middleware
	mux.Post("/api/v1/Appointment/Create", dynamicMiddleware.ThenFunc(app.createAppointment))
	mux.Get("/api/v1/Appointment/byName/:lastName", dynamicMiddleware.ThenFunc(app.showAppointmentsByName))
	mux.Get("/api/v1/Appointment/byID/:id", dynamicMiddleware.ThenFunc(app.showAppointmentByID))
	mux.Get("/api/v1/Appointment/byEmail/:email", dynamicMiddleware.ThenFunc(app.showAppointmentByEmail))
	mux.Put("/api/v1/Appointment/updateResult/", dynamicMiddleware.ThenFunc(app.updateResult))
	// mux.Get("/api/v1/Timeslots/show/getByDate/:date", dynamicMiddleware.ThenFunc(app.getTimeslotsByDate))
	// mux.Get("/api/v1/Timeslots/:id", dynamicMiddleware.ThenFunc(app.showTimeslotById))

	mux.Get("/api/v1/put/", dynamicMiddleware.ThenFunc(app.putSessionSnippet))
	mux.Get("/api/v1/get/", dynamicMiddleware.ThenFunc(app.getSessionSnippet))
	return standartMiddleware.Then(mux)
}
