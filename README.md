# Pharmacy Finder feeder

PhantonJS scripts to scrape PSI Web site to feed pharmacy database into SQL Azure database.

# Implementation Details

- Setup a valid cookie, as shown on code snippet below

"phantom.addCookie({
    'name': 'PHPSESSID',
    'value': 'vk9vfd0ea5nfohhq32fv7sq442',
    'domain': 'public.thepsi.ie'
});"



Basically psi_scrape.js file read a input_file.txt which contains a list of web site urls containing Pharmacy specific details e.g. Opneinig time, Name, address, phone number, etc.
