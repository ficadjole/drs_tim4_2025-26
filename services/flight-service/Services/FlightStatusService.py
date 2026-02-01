from datetime import datetime, timedelta

class FlightStatusService:
    @staticmethod
    def get_status(flight):
        if flight.cancelled:
            return "CANCELLED"

        now = datetime.now()
        start_time = flight.departureTime
        end_time = start_time + timedelta(minutes=flight.flightDuration)

        if now < start_time:
            return "NOT_STARTED"
        elif start_time <= now <= end_time:
            return "IN_PROGRESS"
        else:
            return "FINISHED"