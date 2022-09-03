# yourstage
A PERN stack application to assist users with keeping track of cargo being staged after packing, but pending for driver pick up.

This application is currently hosted on heroku.

## Background
I created this stack after learning javascript and nodejs to solve an issue at work.

- In the warehousing industry, the general process for an outbound shipment is to
  - Pick from location
  - Packing of picked cargo
  - Staging of packed cargo
  - Release packed cargo to driver
- The issue arises when after the packing stage, the cargo is being staged the packing area without its own location. Generally at this stage, the cargo has also been pgi (post goods issued) from the warehouse management system. If this is not managed properly, it would be time-consuming to search for the packed cargo to release to driver. Chance of mix up will also increase dramatically
- This application aims to resolve the issue by allowing users to continue tracking the cargo location asynchronously with other users in the same warehouse

<img src="/Page%20screenshots/Methodology.png">

## Screenshots
- Main search page
<img src="/Page%20screenshots/Main%20Seach%20Page.jpeg" width="250">
- Search result page
<img src="/Page%20screenshots/Result%20Page.jpeg" width="250">
- Putaway page
<img src="/Page%20screenshots/Putaway%20Page.jpeg" width="250">
- Add cargo function
<img src="/Page%20screenshots/Add%20Function.jpeg" width="250">
- Delete cargo function
<img src="/Page%20screenshots/Delete%20Function.jpeg" width="250">
- Move cargo function
<img src="/Page%20screenshots/Move%20Function.jpeg" width="250">
- Release cargo function
<img src="/Page%20screenshots/Release%20Function.jpeg" width="250">

