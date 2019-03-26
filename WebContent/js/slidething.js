"use strict"

var slidedata;
var rootslidegroup;
var slidegroup;
var slidegroupelem;
var slideNo = 1;
var slideCount = 1;
var includeLit; // true: "lit:(tagname)"; false: "(tagname)"
var initialized = false;
var slidelist;

function Prev() {
	if (slideNo > 1)
	{
		slideNo--;
		UpdateSlideData();
	}
}

//console.log("Test if this works!");

function Next() {
	if (slideNo < slideCount)
	{
		slideNo++;
		UpdateSlideData();
	}
}

function postInit() {
	initialized = true;
	console.log("Finished PostInitialization Stage!");
}



function UpdateSlideData()
{
	let data;
	if (includeLit)
	{
		slideCount = slidegroup.getElementsByTagName("lit:slide").length - 1;
		data = slidegroup.children["slide"+slideNo].getElementsByTagName("lit:data")[0].textContent;
	}
	else
	{
		slideCount = slidegroup.getElementsByTagName("slide").length - 1;
		data = slidegroup.children["slide"+slideNo].getElementsByTagName("data")[0].textContent;
	}
	document.getElementById("main").innerHTML = data;
	if (slideNo === 1)
	{
		document.getElementById("prev").disabled = true;
	} else {
		document.getElementById("prev").disabled = false;
	}
	if (slideNo === slideCount)
	{
		document.getElementById("next").disabled = true;
	} else {
		document.getElementById("next").disabled = false;
	}
	document.getElementById("mid").disabled = true;
	
}

function hoverIn(slideGroup)
{
	
}

function hoverOut(slideGroup)
{
	
}

function addTextToList(stringToAdd)
{
	slidelist.innerHTML = slidelist.innerHTML + "<li><button id=\"slidelist_" + stringToAdd + 	"\" onclick=\"setSlideGroup(this)\" onmouseover=\"hoverIn(this)\" onmouseout=\"hoverOut(this)\">" + stringToAdd + "</button></li>  ";
	
}

function setSlideGroup(newSlideGroup)
{
	console.log("SETTING SLIDE GROUP TO: " + newSlideGroup.innerHTML);
	if (slidegroupelem == null) {} else
	{
		slidegroupelem.disabled = false;
	}
	
	//slidegroup.disabled = false;
	slidegroup = rootslidegroup.children[newSlideGroup.innerHTML];
	slidegroupelem = newSlideGroup;
	slidegroupelem.disabled = true;
	
	//console.log(buttonNew);
	
	slidegroupelem.disabled = true;
	
	//slidegroup.disabled = true;
	UpdateSlideData();
	
}

function preInit() {
	try {
		var request = new XMLHttpRequest();
		request.open('GET', "xml/slidedata.xml");
		request.send();
		request.onload = function() {
			var datatxt = request.response;
			var parser = new DOMParser();
			var data = parser.parseFromString(datatxt,"text/xml");
			console.log("Recived Slide Data!");
			console.log("Finished PreInitialization Stage!")
			console.log("Entering Initialization Stage!")
			
			Init(data);
		}
	}catch(e){
		console.error("Failed to Initialize because:");
		console.error(e);
		return;
	}
}

function Init(data) {
	slidedata = data;
	console.log("globalized slide data!");
	if (slidedata.getElementsByTagName("lit:root_slide_group").length > 0)
	{
		includeLit = true;
	} else if (slidedata.getElementsByTagName("root_slide_group").length > 0)
	{
		includeLit = false;
	}
	
	if (slidedata.getElementsByTagName("lit:root_slide_group").length > 1 || slidedata.getElementsByTagName("root_slide_group").length > 1)
	{
		console.error("Too many root_slide_group(s)! Combine all the root_slide_group(s) into one!");
		return;
	}
	
	if (slidedata.getElementsByTagName("lit:root_slide_group").length == 0 && slidedata.getElementsByTagName("root_slide_group").length == 0)
	{
		console.error("No root_slide_groups! Use the tag name \"lit:root_slide_group\" in the xml!")
	}
	
	if (includeLit)
	{
		rootslidegroup = slidedata.getElementsByTagName("lit:root_slide_group")[0];
	}
	else
	{
		rootslidegroup = slidedata.getElementsByTagName("root_slide_group")[0];
	}
	
	console.log(rootslidegroup);
	var children = rootslidegroup.children;
	
	console.log(children);
	for (var i = 0; i < children.length; i++)
	{
		if ((children[i].tagName === "lit:slide_group") || (children[i].tagName === "slide_group"))
		{
			console.log(children[i]);
		}
	}
	
	slidelist = document.getElementById("slidelist");
	slidelist.innerHTML = "";
	for (var i = 0; i < rootslidegroup.children.length; i++)
	{
		addTextToList(rootslidegroup.children[i].id);
		
	}
	
	setSlideGroup(document.getElementById("slidelist_init"));
	
	console.log("Finished Initialization Stage!");
	console.log("Starting PostInitialization Stage!");
	postInit();
}

window.onload = function() {
	console.log("Starting Preinitialization...");
	//PreInitialization is to get the data for the slides...
	preInit();
}