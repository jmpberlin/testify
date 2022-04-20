package postgres

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"johannespolte.de/testify/pkg/models"
)

type TimeslotModel struct {
	DB *sql.DB
}

func (m *TimeslotModel) GetById(id int) (timeslot *models.TimeSlot, err error) {
	stmt := `SELECT * FROM timeslots
    WHERE id=$1 AND taken = false`
	row := m.DB.QueryRow(stmt, id)
	t := &models.TimeSlot{}
	err = row.Scan(&t.ID, &t.Taken, &t.StartTime)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, models.ErrNoRecord
		} else {
			return nil, err
		}
	}
	return t, nil
}

func (m *TimeslotModel) IsAvailable(id int) error {
	stmt := `SELECT * FROM timeslots
    WHERE id=$1`
	t := &models.TimeSlot{}
	err := m.DB.QueryRow(stmt, id).Scan(&t.ID, &t.Taken, &t.StartTime)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return models.ErrNoRecord
		}
	}
	if t.Taken {
		return models.ErrTimeslotUnavailable
	}
	return nil
}

func (m *TimeslotModel) SetToTaken(id int) error {
	stmt := `UPDATE timeslots
	SET taken=true
	WHERE id = $1`
	_, err := m.DB.Exec(stmt, id)
	if err != nil {
		return err
	}
	return nil
}

func (m *TimeslotModel) GetAllByDate(dateTime time.Time) (timeslots []*models.TimeSlot, err error) {
	stmt := `
	SELECT * FROM timeslots WHERE start_time::date = $1 AND taken = false ORDER BY start_time ASC;
	`
	date := fmt.Sprintf("%d-%d-%d", dateTime.Year(), dateTime.Month(), dateTime.Day())
	rows, err := m.DB.Query(stmt, date)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	timeslotSlice := []*models.TimeSlot{}
	for rows.Next() {
		t := &models.TimeSlot{}
		err = rows.Scan(&t.ID, &t.Taken, &t.StartTime)
		if err != nil {
			return nil, err
		}
		timeslotSlice = append(timeslotSlice, t)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	if len(timeslotSlice) == 0 {
		return nil, models.ErrNoRecord
	}

	return timeslotSlice, nil
}
