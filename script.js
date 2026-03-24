let searchBtn=document.querySelector("#searchBtn");
let searchInput=document.querySelector("#searchInput");
let results=document.querySelector("#results");
let mealCard=document.querySelector(".meal-card");
let mealInfo=document.querySelector(".meal-info");
let modalInnerBody=document.querySelector(".modal-body");
let modalBody=document.querySelector('#modalBody');
let modalHeader=document.querySelector(".modal-header");
let closeBtn=document.querySelector("#closeBtn");




searchBtn.addEventListener("click",async()=>{
    if(searchInput.value.trim() ==""){
        results.innerHTML = "<p>Type the meal name..</p>";
        console.log("Please enter a search term");
        return;
    }
    const response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput.value}`);
    const data=await response.json();
    if (data.meals) {
        mealCard.classList.remove("hidden");
        results.innerHTML = "";
    data.meals.forEach((item) => {            
         const template = mealCard.cloneNode(true);
         template.dataset.id=item.idMeal;
         const img = template.querySelector("img");
        console.log(img);
        img.src = item.strMealThumb;  
        const info = template.querySelector(".meal-info");
        info.innerHTML=`<h3>${item.strMeal}</h3>
        <p>${item.strCategory}-${item.strArea}</p>`
        results.appendChild(template);
searchInput.value = "";
    })
    console.log(data);
    }else {
     results.innerHTML = "No meals found";
    }

})

results.addEventListener("click",async(e)=>{
  const mealCard = e.target.closest(".meal-card");  
  if(!mealCard)return;

  const selectedMealId = mealCard.dataset.id;

  modalHeader.querySelector("img").src = mealCard.querySelector("img").src;
  const info = mealCard.querySelector(".meal-info");
  modalHeader.querySelector("h2").textContent = info.querySelector("h3").textContent;
  modalHeader.querySelector("p").textContent = info.querySelector("p").textContent;


  let response=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selectedMealId}`)
  let data=await response.json();
  const mealInstructions = data.meals[0].strInstructions;
  const incredients = [];
  Object.keys(data.meals[0]).forEach((item) => {
    if(item.startsWith("strIngredient")){
        const incredent=data.meals[0][item];
        if(incredent?.trim()){
            incredients.push(incredent);
        }
    }
  })
  const ul=modalInnerBody.querySelector("ul");
  ul.innerHTML= "";
  incredients.forEach((item) =>{
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  })
   
  let steps = mealInstructions.split(/\r?\n/).filter(step => step.trim());
  const para = modalInnerBody.querySelector("p");
  para.textContent = "";
  
  steps.forEach((step,index) => {    
    
    const clean=step.trim().toLowerCase();
    if (clean === "" || clean.startsWith("step")) return;
    // para.textContent += `Step ${index+1}: ${step.trim()}\n\n
    // `;  
   
        para.innerHTML += `Step ${index+1}: ${step.trim()}<br/><br/>\r\n`; 
    
  })
  modalInnerBody.appendChild(para);
  
  

  const modal = document.getElementById("modal");
  modal.style.display = "block";

  console.log(mealCard);
  console.log(selectedMealId);  
})

closeBtn.addEventListener("click",()=>{
    const modal = document.getElementById("modal");
    modal.style.display = "none";
})

// https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771