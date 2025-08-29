let linkDef = document.querySelectorAll('.hrefNav');
let placeAnimalsOutput = document.querySelector('.Animals-tabs');
let chooseAnimal =  document.querySelector('#choose-Animal');
let inputNameAnimal = document.querySelector('.search-input');
let discriptionAnimals = document.querySelector('.discription-animals');
let backList = document.querySelector('.backList');
let nextList = document.querySelector('.nextList');

linkDef.forEach(item => {
    item.addEventListener('click', ()=> {
        event.preventDefault();
    });
})

async   function getAllAnimals() {
    let respons = await fetch('./animals.json');
    let data = await respons.json();
    // createAPageAnimal(data);
    return data;
}

getAllAnimals();
function createAPageAnimal (data) {
    placeAnimalsOutput.innerHTML = '';
    for (let i =0; i<=data.length-1;i++) {
        let newCard = document.createElement('div');
        newCard.classList.add(data[i].name, 'flexAnimal');
        newCard.innerHTML = ` <img src="${data[i].image}" alt="">
            <h4>${data[i].name}</h4>
            <p class="Animals-species">${data[i].species}</p>
            <a href="" class="alloverviewAnimals">Подробнее</a>`
        placeAnimalsOutput.appendChild(newCard);
    }
    let alloverviewAnimals = document.querySelectorAll('.alloverviewAnimals');
    alloverviewAnimals.forEach(item => {
        item.addEventListener('click', outputOverview)
    })
}

async function outputOverview (){
    event.preventDefault();
    discriptionAnimals.innerHTML = '';
    let e = event.target.closest('div').classList[0];
    let data = await getAllAnimals();
    let OverviewData = data.filter(item=> item.name==e);
    console.log();
     let newCard = document.createElement('div');
        newCard.classList.add('OverviewData');
        newCard.innerHTML = `<h4>Имя: ${OverviewData[0].name}</h4>
                            <p>Тип: ${OverviewData[0].species}</p>
                            <p>Описание: ${OverviewData[0].description}</p>`
        discriptionAnimals.appendChild(newCard);

}



async function searchAnimals(data) {

    // let data = await getAllAnimals();

    if (chooseAnimal.value=='Zero' && inputNameAnimal.value.trim()=='') {
        return data;
    } else if (chooseAnimal.value!='Zero' && inputNameAnimal.value.trim()=='') {
        let FilterAnimals = data.filter(item=> item.species==chooseAnimal.value);
        return FilterAnimals;
    } else if(chooseAnimal.value=='Zero' && inputNameAnimal.value.trim()!=''){
        let FilterAnimals = data.filter(item=> item.name.toLowerCase().includes(inputNameAnimal.value.toLowerCase()));
        return FilterAnimals;
    } else {
        let FilterAnimals = data.filter(item=> item.species==chooseAnimal.value && item.name.toLowerCase().includes(inputNameAnimal.value.toLowerCase()));
        return FilterAnimals;
    }
}
// -------------
let counterPage =  1;


chooseAnimal.addEventListener('input', outputAnimalsPerScreen);
inputNameAnimal.addEventListener('input', outputAnimalsPerScreen);

window.addEventListener('resize', (event)=> {
   outputAnimalsPerScreen(event);
});

backList.addEventListener('click', (event)=> {
    outputAnimalsPerScreen(event);
})
nextList.addEventListener('click', (event)=> {
    outputAnimalsPerScreen(event);
})


async function outputAnimalsPerScreen(event) {
     let allData = await getAllAnimals();
     let e = event.target;
    if (event.type === 'resize') {
        pageNumber(counterPage,await searchAnimals(allData), getNumberPerPAge());
        calcOutputPage(getNumberPerPAge(),counterPage, await searchAnimals(allData));
    } else if (e.classList.contains('search-input') || e.id ==='choose-Animal')  {
        pageNumber(counterPage,await searchAnimals(allData), getNumberPerPAge());
        calcOutputPage(getNumberPerPAge(),counterPage, await searchAnimals(allData));
    } else if (e.classList.contains('backList'))  {
        viewPAge ('-',allData);
        console.log('work');
        pageNumber(counterPage,await searchAnimals(allData), getNumberPerPAge());
    } else if (e.classList.contains('nextList')) {
        viewPAge ('+', allData);
        pageNumber(counterPage,await searchAnimals(allData), getNumberPerPAge());
        console.log('work');

    }
}


async function viewPAge (valueOperator, data) {
    if (Math.ceil(data.length / getNumberPerPAge())>counterPage+1) console.log('breacke');
    if (valueOperator ==  '+') {
        counterPage++;
    }  else  if (valueOperator =='-') {
        counterPage--;
    }
    console.log(data);
     calcOutputPage(getNumberPerPAge(),counterPage, await searchAnimals(data));
}


function getNumberPerPAge() {
     if (window.innerWidth>900) {
        return 9
    } else if (window.innerWidth<=900 && window.innerWidth>=550) {
        return 4
    } else {
        return 3
    }
}

function pageNumber(current, data, perPage) {
  const numberOfPage = document.querySelector('.numberOfPage');
  const total = Math.ceil(data.length / perPage);
  if (total== 0 ) total = 1;
  numberOfPage.innerHTML = `Страница ${current} из ${total}`;
}

async function calcOutputPage(perPage, pageNumberNow, data) {
    console.log(data);

  const start = (pageNumberNow - 1) * perPage;
  const newArray = data.slice(start, start + perPage);
  createAPageAnimal(newArray);
}