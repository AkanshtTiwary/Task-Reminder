/**let family = new Array("Neha" ,"father", "mother", "sister", "brother");
let cousins = ["simmi","krish","sakshi","aaru"];
let friends = ["V", "Rohini", "sejal" , "shravani"];
let allMembers = family.concat(cousins,friends);
console.log(allMembers);
-----------------------------------
let nums =["sr","ay","me"];
nums.push("Jab");
nums.unshift("Neha");
nums.pop();
nums.shift();
console.log(nums);

-------------------------------------------

let quote = "welcome to lovely professional university";
let value = quote.split(" ");
console.log(value);
------------------------------------------
let data = ["hi", "i","am", "neha"];
let res = data.join(" ");
console.log(res); 

------------------------------------------

let val = [2,4,6,8,10,24];
let a= val.every(num => num%2 == 0);
console.log(a);
-------------------------------------
//objects
let data2=[{
    name:"Neha",class:"PR",cgpa:9
}, { name:"hi",class:"DH",cgpa:7},{name:"Seeta", class:"TQ",cgpa:9}]
console.log(data2.cgpa);
-------------------------------------------------
let toppers = data.filter(x=> x.cgpa > 8);
console.log(toppers);

-----------------------------------------------
let result = [];
let nums1 = [2, 6, 8, 10, 11, 14, 21, 27];

for (let i = 0; i < nums1.length; i++) {
    if (nums1[i] % 2 === 0) {
        result.push(nums1[i] + 2);
    } else {
        result.push(nums1[i] + 5);
    }
}
    console.log(result);
   

-----------------------------------

/**let nums1 = [2, 6, 8, 10, 11, 14, 21, 27];
let result=[];
nums1.forEach((num, index,arr) => {
    if (num % 2 === 0) {
        arr[index] = num + 2;
    } else {
        arr[index] = num + 5;
    }
});
console.log(nums1);

-----------------------------------

let nums1 = [2, 6, 8, 10, 11, 14, 21, 27];

let found = nums1.find(num => num % 2 === 0);
console.log(found);

---------------------------------
let nums1 = [2, 6, 8, 10, 11, 14, 21, 27];

let result = Array.from(nums1, num => 
    num % 2 === 0 ? num + 2 : num + 5
);

console.log(result);

---------------------------------------

let nums1 = [2, 6, 8, 10, 11, 14, 21, 27];
let r=nums1.indexOf(10);
console.log(r);

-----------------------------------------

let nums1 = [2, 6, 8, 10, 11, 14, 21, 27];
let r=nums1.find(x=>x==2);
console.log(r);
**/