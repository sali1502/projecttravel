"use strict";

import { apikey } from "./apikey.js";

/* Meny */

// Hämta meny-knappar
let openBtn = document.getElementById("open-menu");
let closeBtn = document.getElementById("close-menu");

// Eventlyssnare
openBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

// Toggla fram navigeringsmeny
function toggleMenu() {
    let navMenuEl = document.getElementById("nav-menu");

    // Hämta in css för meny
    let style = window.getComputedStyle(navMenuEl);

    // Koll om navigering är synlig, ändrar display block/none
    if (style.display === "none") {
        navMenuEl.style.display = "block";
    } else {
        navMenuEl.style.display = "none";
    }
}

/* Karta med temperaturprognos*/

// Hämta väderprognos
async function getForecast(lat, long) {
    try {
        let response = await fetch(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${long}&apikey=${apikey}`);
        return await response.json();
    } catch (error) {
        console.log("Något gick fel: " + error);
    }
}

// Skriv temperaturprognos från koordinater
async function writeForecast(lat, long) {
    try {
        let data = await getForecast(lat, long);

        let weatherEl = document.getElementById("weather");
        weatherEl.innerHTML = "";

        let daily = data.timelines.daily;

        // Skriv ut till DOM
        daily.forEach(day => {

            let dateForm = formatDate(day.time);

            weatherEl.innerHTML += `
            <article>
            <h2>${dateForm}</h2>
            <p>Högst: ${day.values.temperatureMax}&#8451
            <br>Lägst: ${day.values.temperatureMin}&#8451
            </p>
            </article>
            `;
        });

    } catch (error) {
        console.log("Något gick fel" + error);
    }
}

// Formatera datum 
function formatDate(dateString) {
    let date = new Date(dateString);
    let day = date.getDay();
    let weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
    let month = date.getMonth() + 1;
    let days = date.getDate();

    return `${weekdays[day]} ${days}/${month}`;
}

// Sökbar karta
document.addEventListener('DOMContentLoaded', () => {
    let searchInput = document.getElementById('searchInput');
    let searchBtn = document.getElementById('searchBtn');
    let map = L.map('map').setView([59.32, 18.05], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let marker;

    async function searchLocation(query) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const coordinates = [lat, lon];
                map.setView(coordinates, 15);

                if (marker) {
                    marker.setLatLng(coordinates);
                } else {
                    marker = L.marker(coordinates).addTo(map);
                }

                writeForecast(lat, lon);

            } else {
                alert('Platsen kunde inte hittas...');
            }
        } catch (error) {
            console.error('Något gick fel...', error);
        }
    }

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value;
        if (query.trim() !== "") {
            searchLocation(query);
        } else {
            alert('Skriv in en plats i sökrutan...');
        }
    });
});

// Sök land med flagga
const url = "https://restcountries.com/v3.1/all?fields=name,capital,region,area,population,cca2";

window.onload = init;

async function init() {
    document.getElementById('searchBtnCountry').addEventListener('click', getCountryData);
}

// Hämta data om länder
async function getCountryData() {
    try {
        const response = await fetch(url);
        let countries = await response.json();

        const countryInput = document.getElementById('searchInputCountry').value.trim();
        const filteredCountry = countries.filter((country) => country.name.common.toLowerCase() === countryInput.toLowerCase());

        if (filteredCountry.length > 0) {
            displayCountries(filteredCountry);
        } else {
            document.getElementById("error").innerHTML = "<p>Landet hittades inte...</p>";
        }
    } catch {
        document.getElementById("error").innerHTML = "<p>Något gick fel...</p>";
    }
}

// Skriv ut data om länder med flagga
function displayCountries(countries) {
    const countriesEl = document.querySelector("#country-list tbody");
    countriesEl.innerHTML = "";

    countries.forEach((country) => {
        let flagUrl;
        if (country.name.common === "United Kingdom") {
            flagUrl = "https://flagsapi.com/GB/flat/32.png";
        } else if (country.name.common === "Austria") {
            flagUrl = "https://flagsapi.com/AT/flat/32.png";
        } else if (country.name.common === "Belgium") {
            flagUrl = "https://flagsapi.com/BE/flat/32.png";
        } else if (country.name.common === "Bulgaria") {
            flagUrl = "https://flagsapi.com/BG/flat/32.png";
        } else if (country.name.common === "Croatia") {
            flagUrl = "https://flagsapi.com/HR/flat/32.png";
        } else if (country.name.common === "Cyprus") {
            flagUrl = "https://flagsapi.com/CY/flat/32.png";
        } else if (country.name.common === "Czechia") {
            flagUrl = "https://flagsapi.com/CZ/flat/32.png";
        } else if (country.name.common === "Denmark") {
            flagUrl = "https://flagsapi.com/DK/flat/32.png";
        } else if (country.name.common === "Estonia") {
            flagUrl = "https://flagsapi.com/EE/flat/32.png";
        } else if (country.name.common === "Finland") {
            flagUrl = "https://flagsapi.com/FI/flat/32.png";
        } else if (country.name.common === "France") {
            flagUrl = "https://flagsapi.com/FR/flat/32.png";
        } else if (country.name.common === "Germany") {
            flagUrl = "https://flagsapi.com/DE/flat/32.png";
        } else if (country.name.common === "Greece") {
            flagUrl = "https://flagsapi.com/GR/flat/32.png";
        } else if (country.name.common === "Hungary") {
            flagUrl = "https://flagsapi.com/HU/flat/32.png";
        } else if (country.name.common === "Ireland") {
            flagUrl = "https://flagsapi.com/IE/flat/32.png";
        } else if (country.name.common === "Italy") {
            flagUrl = "https://flagsapi.com/IT/flat/32.png";
        } else if (country.name.common === "Latvia") {
            flagUrl = "https://flagsapi.com/LV/flat/32.png";
        } else if (country.name.common === "Lithuania") {
            flagUrl = "https://flagsapi.com/LT/flat/32.png";
        } else if (country.name.common === "Luxembourg") {
            flagUrl = "https://flagsapi.com/LU/flat/32.png";
        } else if (country.name.common === "Malta") {
            flagUrl = "https://flagsapi.com/MT/flat/32.png";
        } else if (country.name.common === "Norway") {
            flagUrl = "https://flagsapi.com/NO/flat/32.png";
        } else if (country.name.common === "Netherlands") {
            flagUrl = "https://flagsapi.com/NL/flat/32.png";
        } else if (country.name.common === "Poland") {
            flagUrl = "https://flagsapi.com/PL/flat/32.png";
        } else if (country.name.common === "Portugal") {
            flagUrl = "https://flagsapi.com/PT/flat/32.png";
        } else if (country.name.common === "Romania") {
            flagUrl = "https://flagsapi.com/RO/flat/32.png";
        } else if (country.name.common === "Slovakia") {
            flagUrl = "https://flagsapi.com/SK/flat/32.png";
        } else if (country.name.common === "Spain") {
            flagUrl = "https://flagsapi.com/ES/flat/32.png";
        } else if (country.name.common === "Sweden") {
            flagUrl = "https://flagsapi.com/SE/flat/32.png";
        } else {
            flagUrl = `https://flagsapi.com/${country.cca2}/flat/32.png`;
        }

        // Skriv ut data med flagga i tabell
        countriesEl.innerHTML += `
        <tr>
            <td>  
                <picture>
                    <source srcset="${flagUrl}?as=webp&width=32" type="image/webp">
                    <img src="${flagUrl}" alt="${country.name.common} flagga" class="flag">
                </picture>
            </td>
            <td>${country.name.common}</td>
            <td>${country.capital}</td>
            <td>${country.region}</td>
            <td>${country.area}</td>
            <td>${country.population}</td>
        </tr>
        `;
    });
}

