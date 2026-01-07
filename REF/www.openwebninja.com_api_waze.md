# Waze API | OpenWeb Ninja

**URL:** https://www.openwebninja.com/api/waze

---

We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic. By clicking “Accept,” you agree to our website's cookie use as described in our Cookie Policy. You can change your cookie settings at any time by clicking “Preferences.”
Preferences
Decline
Accept

🚀 We're hiring! OpenWeb Ninja is looking for skilled developers with scraping & reverse-engineering experience - Apply Here

OpenWeb Ninja
APIs
Docs
Community
Sales
Contact Us
Login
Sign Up
Waze API
Get Alerts such as Accidents, Hazards, Police, Traffic Jams, and Navigation / Driving Directions from Waze / Google in Real-Time.
Try for Free
View Documentation

Also available on RapidAPI -

API Data Samples

Response data samples of the different kinds of objects the API provides

Alerts & Jams
{
    "alerts": [
        {
            "alert_id": "1198452451",
            "type": "ROAD_CLOSED",
            "subtype": "ROAD_CLOSED_EVENT",
            "reported_by": "krzycholub",
            "description": null,
            "image": null,
            "publish_datetime_utc": "2024-01-05T15:41:34.000Z",
            "country": "US",
            "city": "Jersey City, NJ",
            "street": "Barrow St",
            "latitude": 40.720179,
            "longitude": -74.045089,
            "num_thumbs_up": 30,
            "alert_reliability": 10,
            "alert_confidence": 5,
            "near_by": null,
            "comments": [],
            "num_comments": 0
        },
        {
            "alert_id": "1310547724",
            "type": "HAZARD",
            "subtype": "HAZARD_ON_SHOULDER_CAR_STOPPED",
            "reported_by": null,
            "description": null,
            "image": null,
            "publish_datetime_utc": "2024-09-29T09:50:46.000Z",
            "country": "US",
            "city": "Queens, NY",
            "street": "I-678 S • Van Wyck Expwy",
            "latitude": 40.671946,
            "longitude": -73.801267,
            "num_thumbs_up": 5,
            "alert_reliability": 10,
            "alert_confidence": 2,
            "near_by": null,
            "comments": [],
            "num_comments": 0
        },
        {
            "alert_id": "1310544787",
            "type": "HAZARD",
            "subtype": "HAZARD_ON_ROAD_LANE_CLOSED",
            "reported_by": "HAAS Alert",
            "description": "Road Work Ahead - move LEFT",
            "image": null,
            "publish_datetime_utc": "2024-09-27T17:00:22.000Z",
            "country": "US",
            "city": "Brooklyn, NY",
            "street": "Atlantic Ave",
            "latitude": 40.676448,
            "longitude": -73.890812,
            "num_thumbs_up": 4,
            "alert_reliability": 10,
            "alert_confidence": 1,
            "near_by": null,
            "comments": [],
            "num_comments": 0
        },
        {
            "alert_id": "1261096082",
            "type": "HAZARD",
            "subtype": "HAZARD_ON_ROAD_CONSTRUCTION",
            "reported_by": "TRANSCOM",
            "description": " Construction GARDEN ST both ways All lanes closed",
            "image": null,
            "publish_datetime_utc": "2024-09-16T04:00:00.000Z",
            "country": "US",
            "city": "Hoboken, NJ",
            "street": "Garden St",
            "latitude": 40.754057,
            "longitude": -74.027716,
            "num_thumbs_up": 1,
            "alert_reliability": 8,
            "alert_confidence": 0,
            "near_by": null,
            "comments": [],
            "num_comments": 0
        },
        {
            "alert_id": "1261105693",
            "type": "HAZARD",
            "subtype": "HAZARD_ON_ROAD_CONSTRUCTION",
            "reported_by": "TRANSCOM",
            "description": " Construction GARDEN ST both ways All lanes closed",
            "image": null,
            "publish_datetime_utc": "2024-09-16T04:00:00.000Z",
            "country": "US",
            "city": "Hoboken, NJ",
            "street": "Garden St",
            "latitude": 40.754677,
            "longitude": -74.027525,
            "num_thumbs_up": 0,
            "alert_reliability": 6,
            "alert_confidence": 0,
            "near_by": null,
            "comments": [],
            "num_comments": 0
        },
        {
            "alert_id": "1310559111",
            "type": "POLICE",
            "subtype": null,
            "reported_by": "DwightMullinsSpeedy",
            "description": null,
            "image": null,
            "publish_datetime_utc": "2024-09-29T09:10:13.000Z",
            "country": "US",
            "city": "Queens, NY",
            "street": "I-678 S • Whitestone Expwy",
            "latitude": 40.76964,
            "longitude": -73.836183,
            "num_thumbs_up": 5,
            "alert_reliability": 10,
            "alert_confidence": 1,
            "near_by": null,
            "comments": [],
            "num_comments": 0
        }
    ],
    "jams": [
        {
            "jam_id": "1220881136",
            "type": "NONE",
            "level": 5,
            "severity": 5,
            "line_coordinates": [
                {
                    "lat": 40.693753,
                    "lon": -73.851933
                },
                {
                    "lat": 40.694153,
                    "lon": -73.852166
                }
            ],
            "start_location": null,
            "end_location": null,
            "speed_kmh": 0,
            "length_meters": 49,
            "delay_seconds": 0,
            "block_alert_id": "1303815157",
            "block_alert_type": "ROAD_CLOSED_EVENT",
            "block_alert_description": "Rail Works",
            "block_alert_update_datetime_utc": "2024-09-28T12:00:08.109Z",
            "block_start_datetime_utc": "2024-09-29T00:00:00.000Z",
            "publish_datetime_utc": "2024-09-29T00:03:34.684Z",
            "update_datetime_utc": "2024-09-29T09:52:50.957Z",
            "country": "US",
            "city": "Queens, NY",
            "street": "Woodhaven Blvd (Service Rd)"
        },
        {
            "jam_id": "1224270046",
            "type": "NONE",
            "level": 2,
            "severity": 5,
            "line_coordinates": [
                {
                    "lat": 40.689092,
                    "lon": -73.921316
                },
                {
                    "lat": 40.690511,
                    "lon": -73.919918
                }
            ],
            "start_location": null,
            "end_location": null,
            "speed_kmh": 5.34,
            "length_meters": 197,
            "delay_seconds": 67,
            "block_alert_id": null,
            "block_alert_type": null,
            "block_alert_description": null,
            "block_alert_update_datetime_utc": null,
            "block_start_datetime_utc": null,
            "publish_datetime_utc": "2024-09-29T09:39:00.168Z",
            "update_datetime_utc": "2024-09-29T09:52:49.126Z",
            "country": "US",
            "city": "Brooklyn, NY",
            "street": "Palmetto St"
        }
    ]
}
Driving Directions
Location Search (Query Completion)
Key Features & Capabilities

The main features and capabilities supported by the API

Get alerts and jams in any geographic location or area worldwide.
Access any Waze alert type, including accidents, hazards, traffic jams, police, and many others.
Get driving directions from Waze.
Search for locations completions from Waze (search autocomplete / typeahead)
API Docs, Playground, & Code Examples

Please check our API docs or try the API on the API Playground. Code samples are available for all languages and frameworks - JavaScript / Node.js, Python, Java, Ruby, cURL, and more:

Why Use OpenWeb Ninja Waze API?

To provide you with top quality API, we work hard every day keeping it fast and reliable while contantly taking user feedback and looking to add new capabilities and features.

Comprehensive

Use the API's extensive capabilities - get comprehensive alerts & jams information from Waze in real-time.

Reliable

Leverage our advanced scraping technology & infrastructure to consistently and reliabily access the data you need.

Lightning Fast

Get the data you need from Waze within seconds or less, keeping your operation fast and smooth.

Scalable

Benefit from our scalable infrastructure to get the data you need in any volume and rate you require, without compromising on performance.

Real-Time Data

Get the most current data available on Waze, ensuring your information is always real-time.

Free Tier

Start with our generous free tier for easy testing and integration (no credit card required).

Plans and Pricing

If the plans below do not meet your needs, please contact us for a custom pricing plan.

Free

$0/mo
100
Requests / Month
Hard limit
Rate Limit
1000 requests per hour
Try Now

Pro

$25/mo
10,000
Requests / Month
+ $0.003 per additional
Rate Limit
10 requests per second
Try Now

Ultra

$75/mo
50,000
Requests / Month
+ $0.002 per additional
Rate Limit
20 requests per second
Try Now

Mega

$150/mo
200,000
Requests / Month
+ $0.001 per additional
Rate Limit
30 requests per second
Try Now
FAQ

Most common questions and answers

Do you offer higher tier or higher volume plans?
How can I subscribe to the Waze API?
How does the Waze API achieves such great speed and scale?
What is the maximum RPS/QPS (reqeusts/queries per seconds) supported by the Waze API?
What is the typical API response time?
Related APIs

Explore other APIs often used together with this API that might also be useful for your project.

Driving Directions API

Get Driving Directions and Best Routes from an Origin to a Destination in Real-Time, from Google Maps.

Data sources
Google Maps

EV Charge Finder API

Super Fast and Simple Real-Time Searches for EV Charging Stations, Anywhere in the World.

Data sources
Google Maps
Web

Local Business Data API

Extremely Comprehensive Local Business / Place / POI Data from Google Maps - Reviews, Photos, Emails, Social, and 30+ Additional Data Points.

Data sources
Google Maps
Web
API By Category
Search & AI
Real-Time Web Search API
Real-Time Image Search API
Real-Time News Data API
Real-Time Short Video Search API
Real-Time Forums Search API
Real-Time Books Search API
Web Search Autocomplete API
Google AI Mode API
Google AI Overviews API
Bing Copilot API
Google News API
Business & Location
Local Business Data API
Local Rank Tracker API
Google Maps Scraper API
Real-Time Zillow Data API
Yelp Business Data API
Trustpilot Data API
Real-Time Events Data API
E-commerce & Products
Real-Time Amazon Data API
Real-Time Product Search API
Real-Time Costco Data API
Real-Time Lens Data API
Reverse Image Search API
Play Store Apps API
Contact & Social
Website Contacts Scraper API
Email Search API
Social Links Search API
Jobs & Finance
JSearch API
Google for Jobs API
Job Salary Data API
Job Scraper API
Real-Time Finance Data API
Remote Jobs API
Transportation
Waze API
Driving Directions API
EV Charge Finder API
OpenWeb Ninja
Real-Time Public Data API Stack
APIs
Docs
Community
Sales
Contact Us
Work with Us
Our Partners
Login
Sign Up

© 2026 OpenWeb Ninja. All rights reserved.

Privacy
Terms

Cookie Settings