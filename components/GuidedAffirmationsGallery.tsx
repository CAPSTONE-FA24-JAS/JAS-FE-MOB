import { Image, View, Text, FlatList, Pressable } from "react-native";
// import { GalleryPreviewData, Product } from "@/constants/models/Product";
import { Link } from "expo-router";
import { GalleryPreviewData } from "@/constants/models/AffirmationCategory";

interface GuidedAffirmationsGalleryProps {
  title: string;
  products: GalleryPreviewData[];
}

const GuidedAffirmationsGallery = ({
  title,
  products,
}: GuidedAffirmationsGalleryProps) => {
  return (
    <View className="my-5">
      <View className="mb-2">
        <Text className="text-xl font-bold text-white">{title}</Text>
      </View>
      <View className="space-y-2">
        <FlatList
          data={products}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Link href={`/affirmations/${item.id}`} asChild>
              <Pressable>
                <View className="w-32 mr-4 rounded-md h-36">
                  <Image
                    source={item.image}
                    resizeMode="cover"
                    className="w-full h-full"
                  />
                  <Text>ProductGallery</Text>
                </View>
              </Pressable>
            </Link>
          )}
          horizontal
        />
      </View>
    </View>
  );
};

export default GuidedAffirmationsGallery;
