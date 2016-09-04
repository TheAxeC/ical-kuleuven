# ical-kuleuven

An nodejs application to create an iCalendar file for KULeuven (University of Leuven).

A builtin scheduler will refresh the iCalendar file daily.
A builtin server can serve the files.

Creating the ical file can be done by running:
``` node src/create_ical.js ```

Running the scheduler and server can be done by running:
``` node src/main.js ```
