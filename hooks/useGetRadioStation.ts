import {useState,useEffect} from "react";
import {URL_API_RADIO,popularFillter,englishFillter,mxSpanishFillter,rock} from "@/constant/initialValue"
import {CategoryRadioStation,RadioStation} from "@/interface/radio"


export default function useGetRadioStation(){
  const [categories,setCategories]=useState<CategoryRadioStation[]>([]);

  const  getRadioStation=async (params:string)=>{
    try{
       let res=await fetch(URL_API_RADIO+params+"&limit=10");
       return await res.json() as RadioStation[]
    }catch(error){
      console.log("error try to get all radio stations by categories");
      return [];
    }
  }

  useEffect(()=>{
    async function loadRadioStationByCategory(){
      let categoriesResponse:CategoryRadioStation[]=[];
      
      let popularResponse=await getRadioStation(popularFillter);
      categoriesResponse.push({
        title:"Popular",
        data:popularResponse
      });

      let rockResponse=await getRadioStation(rock);
      categoriesResponse.push({
        title:"rock",
        data:rockResponse
      })

      let mxSpanishResponse=await getRadioStation(mxSpanishFillter);
      categoriesResponse.push({
        title:"En espanol MX",
        data:mxSpanishResponse
      })


      let englishResponse=await getRadioStation(englishFillter);
      categoriesResponse.push({
        title:"En ingles",
        data:englishResponse
      });

      setCategories(categoriesResponse);
      
    }

    loadRadioStationByCategory()
  },[]);


  return {categories,setCategories}
}