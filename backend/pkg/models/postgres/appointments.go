package postgres

import (
	"database/sql"
	"errors"
	"fmt"
	"time"
	"unicode/utf8"

	"johannespolte.de/testify/pkg/models"
	"johannespolte.de/testify/pkg/validation"
)

type AppointmentModel struct {
	DB *sql.DB
}


func ValidateResultUpdate(v *validation.Validator, appointment *models.Appointment, input *models.ResultInput) {
	v.Check(appointment.FirstName == input.FirstName, "security check", "appointment details are missing, blank or not correct")
	v.Check(appointment.LastName == input.LastName, "security check", "appointment details are missing, blank or not correct")
	v.Check(appointment.Email == input.Email, "security check", "appointment details are missing, blank or not correct")
}
func ValidateAppointment(v *validation.Validator, appointment *models.Appointment) {
	v.Check(appointment.FirstName != "", "first name", "must be provided")
	v.Check(appointment.LastName != "", "last name", "must be provided")
	v.Check(appointment.Duration >= 5 && appointment.Duration <= 10, "duration", "is not valid")
	v.Check(appointment.Service != "", "service", "must be provided")
	v.Check(appointment.AddressName != "", "address name", "must be provided")
	v.Check(utf8.RuneCountInString(appointment.AddressName) < 35, "address name", "can't have more than 35 characters")
	v.Check(appointment.StreetName != "", "street name ", "must be provided")
	v.Check(utf8.RuneCountInString(appointment.StreetName) < 35, "street name", "can't have more than 35 characters")
	v.Check(appointment.StreetNumber != "", "street number", "must be provided")
	v.Check(appointment.ZipCode != "", "zipcode", "must be provided")
	v.Check(appointment.City != "", "city name", "must be provided")
	v.Check(utf8.RuneCountInString(appointment.City) < 35, "city name", "can't have more than 35 characters")
	v.Check(appointment.Country != "", "country name", "must be provided")
	v.Check(utf8.RuneCountInString(appointment.Country) < 35, "country name", "can't have more than 35 characters")
	// v.Check((appointment.StartTime.Add(time.Minute).After(time.Now())), "appointment time", "can't be in the past")
}
func (m *AppointmentModel) Insert(appointment *models.Appointment) error {
	query := `
	INSERT INTO appointments (start_time, first_name, last_name,email, duration,service,address_name,street_name,street_number,zip_code,city,country) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12)
	RETURNING id, created_at`
	args := []interface{}{appointment.StartTime, appointment.FirstName, appointment.LastName, appointment.Email, appointment.Duration, appointment.Service, appointment.AddressName, appointment.StreetName, appointment.StreetNumber, appointment.ZipCode, appointment.City, appointment.Country} // , appointment.TimeSlot
	return m.DB.QueryRow(query, args...).Scan(&appointment.ID, &appointment.CreatedAt)
}

func (m *AppointmentModel) IsAvailable(inputTime time.Time) error {
	inputTimePlusFive := inputTime.Local().Add((time.Minute * time.Duration(4)) + (time.Second * time.Duration(59)))
	stmt := `SELECT * FROM appointments WHERE start_time between $1 and $2`
	date := fmt.Sprintf("%d-%d-%d %d:%d", inputTime.Year(), inputTime.Month(), inputTime.Day(), inputTime.Hour(), inputTime.Minute())
	datePlusFive := fmt.Sprintf("%d-%d-%d %d:%d", inputTimePlusFive.Year(), inputTimePlusFive.Month(), inputTimePlusFive.Day(), inputTimePlusFive.Hour(), inputTimePlusFive.Minute())
	a := &models.Appointment{}
	err := m.DB.QueryRow(stmt, date, datePlusFive).Scan(&a.ID, &a.StartTime, &a.FirstName, &a.LastName, &a.Email, &a.Duration, &a.Service, &a.Result, &a.AddressName, &a.StreetName, &a.StreetNumber, &a.ZipCode, &a.City, &a.Country, &a.CreatedAt, &a.UpdatedAt)
	fmt.Println(a)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil
		}
	}
	return models.ErrTimeslotUnavailable
}

func (m *AppointmentModel) GetByLastName(lastName string) (appointments []*models.Appointment, err error) {
	stmt := `SELECT * FROM appointments WHERE last_name = $1 ORDER BY created_at DESC LIMIT 10`
	rows, err := m.DB.Query(stmt, lastName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	appointmentSlice := []*models.Appointment{}
	for rows.Next() {
		a := &models.Appointment{}
		err = rows.Scan(&a.ID, &a.StartTime, &a.FirstName, &a.LastName, &a.Email, &a.Duration, &a.Service, &a.Result, &a.AddressName, &a.StreetName, &a.StreetNumber, &a.ZipCode, &a.City, &a.Country, &a.CreatedAt, &a.UpdatedAt) //, &a.TimeSlot
		if err != nil {
			return nil, err
		}
		appointmentSlice = append(appointmentSlice, a)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return appointmentSlice, nil
}
func (m *AppointmentModel) GetByID(id int) (appointment *models.Appointment, err error) {
	stmt := `SELECT * FROM appointments
    WHERE id=$1 `
	row := m.DB.QueryRow(stmt, id)
	a := &models.Appointment{}
	err = row.Scan(&a.ID, &a.StartTime, &a.FirstName, &a.LastName, &a.Email, &a.Duration, &a.Service, &a.Result, &a.AddressName, &a.StreetName, &a.StreetNumber, &a.ZipCode, &a.City, &a.Country, &a.CreatedAt, &a.UpdatedAt) // , &a.TimeSlot
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, models.ErrNoRecord
		} else {
			return nil, err
		}
	}
	return a, nil
}
func (m *AppointmentModel) GetByEmail(email string) (appointment []*models.Appointment, err error) {
	stmt := `SELECT * FROM appointments WHERE email = $1 ORDER BY created_at DESC LIMIT 10`
	rows, err := m.DB.Query(stmt, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	appointmentSlice := []*models.Appointment{}
	for rows.Next() {
		a := &models.Appointment{}
		err = rows.Scan(&a.ID, &a.StartTime, &a.FirstName, &a.LastName, &a.Email, &a.Duration, &a.Service, &a.Result, &a.AddressName, &a.StreetName, &a.StreetNumber, &a.ZipCode, &a.City, &a.Country, &a.CreatedAt, &a.UpdatedAt) // , &a.TimeSlot
		if err != nil {
			return nil, err
		}
		appointmentSlice = append(appointmentSlice, a)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return appointmentSlice, nil
}

func (m *AppointmentModel) GetAllByDate(dateTime time.Time) (appointments []*models.Appointment, err error) {
	stmt := `
	SELECT * FROM appointments WHERE start_time::date = $1 ORDER BY start_time ASC;
	`
	date := fmt.Sprintf("%d-%d-%d", dateTime.Year(), dateTime.Month(), dateTime.Day())
	rows, err := m.DB.Query(stmt, date)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	appointmentsSlice := []*models.Appointment{}
	for rows.Next() {
		a := &models.Appointment{}
		err = rows.Scan(&a.ID, &a.FirstName, &a.LastName, &a.Email, &a.Duration, &a.Service, &a.Result, &a.AddressName, &a.StreetName, &a.StreetNumber, &a.ZipCode, &a.City, &a.Country, &a.CreatedAt, &a.UpdatedAt, &a.StartTime)
		if err != nil {
			return nil, err
		}
		appointmentsSlice = append(appointmentsSlice, a)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	if len(appointmentsSlice) == 0 {
		return nil, models.ErrNoRecord
	}

	return appointmentsSlice, nil
}

func (m *AppointmentModel) UpdateResult(a *models.Appointment) error {
	query := `
	UPDATE appointments 
	SET result = $1, updated_at = $2
	WHERE id = $3
	RETURNING *`

	args := []interface{}{
		a.Result,
		a.UpdatedAt,
		a.ID,
	}
	return m.DB.QueryRow(query, args...).Scan(&a.ID, &a.StartTime, &a.FirstName, &a.LastName, &a.Email, &a.Duration, &a.Service, &a.Result, &a.AddressName, &a.StreetName, &a.StreetNumber, &a.ZipCode, &a.City, &a.Country, &a.CreatedAt, &a.UpdatedAt) // , &a.TimeSlot
}
