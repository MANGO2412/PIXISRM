import { Stack } from "expo-router";
import { useColorScheme} from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import LogoHeader,{RightActionHeader} from '@/components/custome/LogoHeader'
import SearchHeader from "@/components/custome/SearchHeader"

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import {SongProvider} from "@/context/song/provider-context"
import {GlobalProvider} from "@/context/reduceContext"
import {PlayerProvider} from "@/context/player/player-context"

import '@/global.css';



export default function RootLayout(){
    // const colorScheme=useColorScheme()
    return (
    //  <GestureHandlerRootView style={{flex:1}}>
         <GluestackUIProvider mode="dark">
           <ThemeProvider value={DarkTheme}>
              <SongProvider>
              <GlobalProvider>
              <PlayerProvider>
                  <Stack>
                     <Stack.Screen
                      name="(tabs)" options={{
                        headerShown:true,
                        headerStyle: { backgroundColor: '#000000' },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                        fontWeight: 'bold',
                         },
                          headerTitle: props => <LogoHeader {...props} />,
                          headerRight:props=> <RightActionHeader {...props}/>,
                        }}/>  
                     {/*modals  */}
                     <Stack.Screen
                       name="setting"
                       options={{
                           presentation:"modal",
                       }}
                     />

                     <Stack.Screen
                       name="search"
                       options={{
                          presentation:"modal",

                          headerTitle: props => <SearchHeader {...props}/>
                       }}
                     />
                     
                    <Stack.Screen
                      name="searchresults"
                      options={{
                         presentation: "card",
                        headerTitle: props => <SearchHeader {...props} openScreen/>
                              
                      }} 
                     />
                    
                    <Stack.Screen
                        name="artistmodal"
                        options={{
                            presentation:"modal",
                            headerTitle:"",
                            headerStyle:{backgroundColor:"rgba(0, 0, 0)"},
                            headerTintColor:"#fff",
                            headerTitleStyle:{fontWeight:"bold"}
                        }}
                    />

                  <Stack.Screen
                        name="albummodal"
                        options={{
                            presentation:"modal",
                            headerTitle:"",
                            headerStyle:{backgroundColor:"rgba(0, 0, 0)"},
                            headerTintColor:"#fff",
                            headerTitleStyle:{fontWeight:"bold"}
                        }}
                    />

                    <Stack.Screen
                      name="songoptions"
                      options={{
                          presentation:"formSheet",
                          sheetCornerRadius: 40,
                          sheetAllowedDetents:[0.5],
                          sheetExpandsWhenScrolledToEdge:false,
                          contentStyle:{backgroundColor:"#343738"},
                          
                          
                      }}
                    />

                    <Stack.Screen
                      name="playedsong"
                      options={{
                          presentation:"formSheet",
                          sheetCornerRadius: 40,
                          contentStyle:{backgroundColor:"#343738"}
                      }}
                    />

                    <Stack.Screen
                      name="playlistmodal"
                      options={{
                          presentation:"formSheet",
                          sheetCornerRadius: 40,
                          contentStyle:{backgroundColor:"#343738"}
                      }}
                    />

                    <Stack.Screen
                      name="lyrics"
                      options={{
                          presentation:"formSheet",
                          sheetCornerRadius: 40,
                            sheetAllowedDetents: [1.0],
                          contentStyle:{backgroundColor:"#343738"}
                      }}
                    />
                </Stack>
              </PlayerProvider>
              </GlobalProvider>
              </SongProvider>
              </ThemeProvider>
         </GluestackUIProvider>
    //  </GestureHandlerRootView>    
  
    )
}