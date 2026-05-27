import { Input,InputField, InputIcon, InputSlot  } from "@/components/ui/input";
import {Search,X} from "lucide-react-native"
import {useState,useContext} from "react"
import {GlobalContext} from "@/context/reduceContext"
import { SearchResponse } from '@/interface/search';
import { useRouter } from 'expo-router';



import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {WEB_REMIX} from "@/constant/clientYoutube"
import Storage from 'expo-sqlite/kv-store';


export default function SearchHeader({children,tintColor,openScreen}:{children: string; tintColor?: string | undefined;openScreen?:boolean }){
   const {state,dispatch}=useContext(GlobalContext)
   let navigation=useRouter()
  const [searchValue,setSearchValue]=useState(state.query||"");


   const processSuggestions = (data: SearchResponse) => {
    const suggestions = data.contents
      .map(section => (section.searchSuggestionsSectionRenderer?.contents?.filter(c => c?.searchSuggestionRenderer) ?? []))
      .filter(c => c.length > 0).map(c => c.map(s => s.searchSuggestionRenderer.navigationEndpoint.searchEndpoint.query))
      .flat();
    return suggestions;
};


   const handleSearch=async (text:string)=>{
     setSearchValue(text);
     try{
        const visitorData = await Storage.getItem('visitorData');
        WEB_REMIX.visitorData = visitorData || "";
        const response=await fetch(URL_API_YOUTUBE+"music/get_search_suggestions?prettyPrint=false",{
                 method:"POST",
                 headers:{
                     "Content-Type":"application/json",
                     "X-Goog-FieldMask":"contents.searchSuggestionsSectionRenderer.contents.searchSuggestionRenderer.navigationEndpoint.searchEndpoint.query",
                     "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                },
                 body:JSON.stringify({
                     context:{
                         client:WEB_REMIX
                     },
                    input:text
                 })
                })
       const data:SearchResponse=await response.json()
       const suggestions=processSuggestions(data) 
       dispatch({ type: "SET_RESULTS", payload: suggestions });
      }catch(error){
        console.log("Error fetching related page:",error)
      }
   }
  return (
     <Input
      variant="rounded"
      size="xl"
      onTouchStart={openScreen?()=>navigation.replace("/search"):()=>{}}
     >
        <InputSlot className="pl-3">
          <InputIcon size="xl" as={Search} />
        </InputSlot>
       <InputField  placeholder="Buscar cancion, artista o album..." value={searchValue} onChangeText={handleSearch} />
       {searchValue.length > 0 &&(
        <InputSlot className="pr-3" onPress={()=>{setSearchValue("")}}>
          <InputIcon size="xl" as={X}  />
        </InputSlot>
       )}
   </Input>
  )
}