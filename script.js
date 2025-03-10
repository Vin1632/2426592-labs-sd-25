const btn = document.getElementById("btn");
    btn.onclick = getData;

    document.getElementById("country_flag").style.display = 'none';
    document.getElementById("img_count").style.display = 'none';
    document.getElementById("border_country").style.display = 'none';
    async function getData() {
    document.getElementById("country_flag").style.display = 'block';
    document.getElementById("img_count").style.display = 'block';
    document.getElementById("border_country").style.display = 'block';
    const name = document.getElementById("input_val").value;
    const url = `https://restcountries.com/v3.1/name/${name}`; 
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        updateCountryInfo(json);
    } catch (error) {
        console.error("Error:", error.message); 
    }
}

async function updateCountryInfo(countryData) {
    const country = countryData[0];
    const countryName = country.name.common;
    const countryCapital = country.capital ? country.capital.join(", ") : "N/A";
    const countryPopulation = country.population;
    const countryRegion = country.region;
    const countryFlag = country.flags.png;
    const borders = country.borders || [];

    document.getElementById("country_name").textContent = countryName;
    document.getElementById("capital").textContent = `Capital: ${countryCapital}`;
    document.getElementById("population").textContent = `Population: ${countryPopulation}`;
    document.getElementById("region").textContent = `Region: ${countryRegion}`;
    document.getElementById("country_flag").src = countryFlag;


    const borderingCountriesContainer = document.getElementById("borders");
    borderingCountriesContainer.innerHTML = ''; 

    borders.forEach(async (border) => {
        try {
            const borderUrl = `https://restcountries.com/v3.1/alpha/${border}`;
            const borderResponse = await fetch(borderUrl);
            if (!borderResponse.ok) throw new Error(`Failed to fetch ${border}`);
            
            const borderData = await borderResponse.json();
            const borderCountry = borderData[0];

            const borderContainer = document.createElement("section");
            borderContainer.classList.add("border-container");

            const borderText = document.createElement("p");
            borderText.classList.add("name_bordering_countries");
            borderText.textContent = borderCountry.name.common;

            const borderFlag = document.createElement("img");
            borderFlag.id = "img_count";
            borderFlag.classList.add("img_bordering_country");
            borderFlag.src = borderCountry.flags.png;
            borderFlag.alt = `${borderCountry.name.common} flag`;

            borderContainer.appendChild(borderText);
            borderContainer.appendChild(borderFlag);
            borderingCountriesContainer.appendChild(borderContainer);
        } catch (error) {
            console.error(`Error fetching border country ${border}:`, error);
        }
    });
}