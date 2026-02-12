from datetime import datetime, timedelta
import pytz

class FlightStatusService:
    @staticmethod
    def get_status(flight):
        if flight.cancelled:
            return "CANCELLED"

        belgrade_tz = pytz.timezone("Europe/Belgrade")
        now = datetime.now(belgrade_tz)

        start_time = flight.departureTime
        if start_time.tzinfo is None:
            start_time = belgrade_tz.localize(start_time)

        end_time = start_time + timedelta(minutes=flight.flightDuration)

        if now < start_time:
            return "NOT_STARTED"
        elif start_time <= now <= end_time:
            return "IN_PROGRESS"
        else:
            return "FINISHED"