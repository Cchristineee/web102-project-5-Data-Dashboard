# Web Development Project 5 - *Data Dashboard Part 1*

Submitted by: **Christine Grimadeau**

This web app: **TicketPulse** is a real-time live entertainment data dashboard built with React and Vite. Utilizing the SeatGeek API, the platform aggregates public box office data to provide an at-a-glance summary of top trending concerts, sporting events, and theatrical productions across the country.

Time spent: **21** hours spent in total

## Required Features

The following **required** functionality is completed:

- [✅] **The site has a dashboard displaying a list of data fetched using an API call**
  - The dashboard should display at least 10 unique items, one per row
  - The dashboard includes at least two features in each row
- [✅] **`useEffect` React hook and `async`/`await` are used**
- [✅] **The app dashboard includes at least three summary statistics about the data** 
  - The app dashboard includes at least three summary statistics about the data, such as:
    - *TotalCount* (Total Events Available)
    - *averagePopularity* (Mean score calculations scaled out of 100%)
    - *eventsInNY (Categorical regional presence counter)
- [✅] **A search bar allows the user to search for an item in the fetched data**
  - The search bar **correctly** filters items in the list, only displaying items matching the search query
  - The list of results dynamically updates as the user types into the search bar
- [✅] **An additional filter allows the user to restrict displayed items by specified categories**
  - The filter restricts items in the list using a **different attribute** than the search bar 
  - The filter **correctly** filters items in the list, only displaying items matching the filter attribute in the dashboard
  - The dashboard list dynamically updates as the user adjusts the filter

The following **optional** features are implemented:

- [ ] Multiple filters can be applied simultaneously
- [ ] Filters use different input types
  - e.g., as a text input, a dropdown or radio selection, and/or a slider
- [ ] The user can enter specific bounds for filter values

The following **additional** features are implemented:

* [ ] List anything else that you added to improve the site's functionality!

## Video Walkthrough

Here's a walkthrough of implemented user stories:
<img width="1425" height="665" alt="TicketPulse" src="https://github.com/user-attachments/assets/2e8eb010-8c02-4ca1-b2ca-ed27c5bbb834" />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with LICEcap


## Notes
Here are some of the challanges I faced in this weeks lab: 

### 1. Handling Missing or Delayed API Data (The "Blank Screen" Bug)
At first, my app kept crashing and showing a completely blank white screen. The console was full of errors like TypeError: can't access property "filter", events is null. This was happening because React was trying to build and render the dashboard before the SeatGeek API had actually finished loading the data. On top of that, some events in the API response didn't even have a ticket price or state listed, which caused things to break.
<br>
**Solution:**
I had to make my code a lot more defensive. I made sure my events state started as an empty array [] instead of null so it always had something to read on the first frame. I also used optional chaining (?.) on things like event.venue?.state. This just tells JavaScript: "Hey, check if the venue exists first; if it doesn't, just skip it instead of crashing the whole website."

### 2. Sneaky Typos and Case-Sensitivity
JavaScript is very case-sensitive which can be fustrating at times as I had a slight mismatch where my state was initialized with a lowercase 't' (selectedtype) but referenced elsewhere in the logic with a capital 'T' (selectedType). Because JavaScript treats these as entirely separate entities, it completely halted my execution initially.
<br>
**Solution:**
I audited the state lifecycle path to ensure strict variable declaration naming conventions matched identically across your state definitions, .filter() conditional blocks, and the JSX dropdown select element.

### 3. Making Summary Stats Update in Real-Time
I wanted my three summary statistics (Total Events, Average Popularity, and NY State Count) to be dynamic. If I calculated them directly from the raw API data, the numbers would just sit there and never change when a user interacted with the app.
<br>
**Solution:**
Instead of running calculations on the raw data, I pointed my math directly at my filtered array (filteredEvents). Because React recalculates this filtered list every single time the user types a letter or changes the dropdown, the summary stats now instantly recalculate in real-time, too.

### 4. Figuring Out Vite’s Strict Environment Rules
Moving my API key into an .env file for security was trickier than expected. I kept getting undefined errors when trying to fetch data, meaning my app wasn't reading the key at all.
<br>
**Solution:**
I learned that Vite has very strict rules for environment variables. First, the variable name must start with the VITE_ prefix, and second, you have to access it using import.meta.env instead of the old Node.js process.env. Once I renamed the key, added it to my .gitignore so it stays off GitHub, and restarted my development server, the connection worked perfectly.


# Web Development Project 6 - *Data Dashboard Part 2*

Submitted by: **Christine Grimadeau**

This web app: **TicketPulse**

Time spent: **X** hours spent in total

## Required Features

The following **required** functionality is completed:

- [ ] **Clicking on an item in the list view displays more details about it**
  - Clicking on an item in the dashboard list navigates to a detail view for that item
  - Detail view includes extra information about the item not included in the dashboard view
  - The same sidebar is displayed in detail view as in dashboard view
  - *To ensure an accurate grade, your sidebar **must** be viewable when showing the details view in your recording.*
- [ ] **Each detail view of an item has a direct, unique URL link to that item’s detail view page**
  -  *To ensure an accurate grade, the URL/address bar of your web browser **must** be viewable in your recording.*
- [ ] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - At least two charts should be incorporated into the dashboard view of the site
  - Each chart should describe a different aspect of the dataset


The following **optional** features are implemented:

- [ ] The site’s customized dashboard contains more content that explains what is interesting about the data 
  - e.g., an additional description, graph annotation, suggestion for which filters to use, or an additional page that explains more about the data
- [ ] The site allows users to toggle between different data visualizations
  - User should be able to use some mechanism to toggle between displaying and hiding visualizations 

  
The following **additional** features are implemented:

* [ ] List anything else that you added to improve the site's functionality!

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

Describe any challenges encountered while building the app.

## License

    Copyright [2026] [Christine Grimadeau]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
