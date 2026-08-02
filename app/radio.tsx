import {View,StyleSheet,FlatList,ScrollView} from "react-native";
import {Skeleton,SkeletonText} from "@/components/ui/skeleton"

import useGetRadioStation from "@/hooks/useGetRadioStation";
import {Text} from '@/components/ui'
import RadioItem from "@/components/custome/RadioItem"
import FooterPlayer from "@/components/custome/FooterPlayer"
import type {RadioStation} from "@/interface/radio"


import {FC} from "react"
const ITEM_WIDTH = 130;
const ITEM_GAP = 12;


const RadioCarousel: FC<{ title: string; data: RadioStation[] }> = ({ title, data }) => {
    if (data.length === 0) return null;

    return (
        <View style={styles.section}>
            <Text size="2xl" className="mb-4 color-typography-950">{title}</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item.stationuuid}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContent}
                ItemSeparatorComponent={() => <View style={{ width: ITEM_GAP }} />}
                renderItem={({ item }) => (
                    <RadioItem
                        radio={item}
                        style={styles.radioItem}
                    />
                )}
            />
        </View>
    );
};


const SkeletonAlbum=()=>(
  <View style={{padding:3}}>
      <Skeleton variant="rounded" className="h-[120px] w-[120px] mb-3" />
      <SkeletonText _lines={4} className="h-2 w-16"/>
  </View>
)

const SkeletonSection=()=>(
    <View style={{marginTop:23}}>
        <SkeletonText _lines={1} className="h-4 w-[200px] mb-4"/>
        <FlatList
            horizontal
            data={Array.from({ length: 4 })}
            showsHorizontalScrollIndicator={false}
            renderItem={({item,index})=><SkeletonAlbum key={index}/>}
        />
    </View>
)


export default function Radio() {
    const {categories}=useGetRadioStation()
    return (
        <View>
           <ScrollView  showsVerticalScrollIndicator={false}>
              {categories.length === 0 ? (
                  <>
                   <SkeletonSection />
                   <SkeletonSection />
                   <SkeletonSection />
                   <SkeletonSection />
                  </>
              ) : (
                categories.map((category, index) => (
                    <RadioCarousel
                        key={index}
                        title={category.title}
                       data={category.data}
                   />
               ))
              )}
             <View style={{ height: 20 }} />
           </ScrollView>
           <FooterPlayer/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    section: {
        marginBottom: 44,
    },
    carouselContent: {
        paddingRight: 16,
    },
    radioItem: {
        width: ITEM_WIDTH,
        alignItems: "center",
    },
});
