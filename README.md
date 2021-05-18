# FORECAST-NEPAL

The context of this test is to provide a simple application to display the city weather forecast of Nepal.

The following features are implemented:

-Display cities locations on a map
-On click on a weather icon, display the next 3 days temperature (t) and humidity (hu) forecast on a chart.
-Deployment using docker and docker-compose
-Also display the weather icon on the chart (The date of the 17 May 12h has been fixed).

## How to run the project

Clone the project:

    git clone https://github.com/ngastineau87/forecast-nepal.git

Run the project (you should have installed docker and docker-compose):

    docker-compose up -d --build

Open [http://localhost:3001](http://localhost:3001) to view it in the browser.
