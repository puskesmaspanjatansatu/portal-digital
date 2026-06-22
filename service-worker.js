const CACHE="portal-v1";


const assets=[

"./",
"./index.html",
"./manifest.json"

];



// install

self.addEventListener(
"install",
event=>{

event.waitUntil(

caches.open(CACHE)
.then(cache=>{

return cache.addAll(assets);

})

);


self.skipWaiting();

});





// activate

self.addEventListener(
"activate",
event=>{


event.waitUntil(

caches.keys()
.then(keys=>{


return Promise.all(

keys.map(key=>{


if(key!==CACHE){

return caches.delete(key);

}


})

);


})

);


});





// offline

self.addEventListener(
"fetch",
event=>{


event.respondWith(


caches.match(
event.request
)
.then(response=>{


return response ||

fetch(event.request);


})


);


});
