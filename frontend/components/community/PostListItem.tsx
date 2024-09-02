import { View, Text,Image, useWindowDimensions } from 'react-native'
import {Ionicons,Feather,AntDesign} from '@expo/vector-icons'
import { AdvancedImage } from 'cloudinary-react-native';
import { cld } from '@/lib/cloudinary';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

export default function PostListItem({post}){
    const {width}= useWindowDimensions();

    const image = cld.image(post.image);
    image.resize(thumbnail().width(width).height(width))

    const avatarUrl = post.user.avatar_url;
    const avatar = cld.image(
      avatarUrl && avatarUrl.startsWith('https://img.clerk.com/')
        ? 'user_ynfjc7'
        : avatarUrl || 'user_ynfjc7'
    );
    avatar.resize(thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face())));

    return (
        <View className='bg-white'>
          
    
    
          <View className='p-3 flex-row items-center gap-2'>
              <AdvancedImage
                cldImg={avatar}
                className='w-12 aspect-square rounded-full'
              />
              <Text className='font-semibold '>{post.user.username || 'New User'}</Text>
          </View>

          <AdvancedImage cldImg={image} className='w-full aspect-[4/3]' />
          {/* Icons */}
          <View className="flex-row gap-3 p-3">
            <AntDesign name="hearto" size={20} />
            <Ionicons name="chatbubble-outline" size={20} />
            <Feather name="send" size={20} />
    
            <Feather name="bookmark" size={20} className="ml-auto" />
          </View>
    
        </View>
    )
}