import React, { useState } from "react";
import { updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "./Reservation.css";

function ReservationDisplay({ reservations }) {
  const [cancelReservationError, setCancelReservationError] = useState(null);

  const handleCancel = async (reservation_id) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      setCancelReservationError(null);
      await updateReservationStatus(
        reservation_id,
        { data: { status: "cancelled" } },
        abortController.signal
      )
        .then(window.location.reload())
        .catch(setCancelReservationError);
      return () => abortController.abort();
    }
  };

  const displayReservations = reservations.map((reservation, index) => {
    return (
      <tr key={index}>
        <th scope="row">{reservation.reservation_id}</th>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.people}</td>
        <td>
          <p data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </p>
        </td>
        <td>
          {reservation.status !== "booked" ? null : (
            <>
              <a
                href={`/reservations/${reservation.reservation_id}/seat`}
                className="btn btn-primary btn-outline-dark mx-1"
              >
                Seat
              </a>
            </>
          )}
          {reservation.status !== "booked" ? null : (
            <>
              <a
                href={`/reservations/${reservation.reservation_id}/edit`}
                className="btn btn-primary btn-outline-dark mx-1"
              >
                Edit
              </a>
            </>
          )}
          {reservation.status !== "booked" ? null : (
            <>
              <button
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={() => handleCancel(reservation.reservation_id)}
                className="btn btn-danger btn-outline-dark mx-1"
              >
                Cancel
              </button>
            </>
          )}
        </td>
      </tr>
    );
  });

  return (
    <>
      <ErrorAlert error={cancelReservationError} />
      <table className="table caption-top">
        <thead>
          <tr>
            <th scope="col">ID #</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>{displayReservations}</tbody>
      </table>
    </>
  );
}

export default ReservationDisplay;