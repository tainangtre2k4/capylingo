import { Image, View, ActivityIndicator } from 'react-native';
import React, { ComponentProps, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type RemoteImageProps = {
  path?: string | null;
  fallback: string | null;
  NameOfStorage: string;
} & Omit<ComponentProps<typeof Image>, 'source'>;

const RemoteImage = ({ path, fallback, NameOfStorage, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) {
      setImage(fallback); // Immediately set fallback if no path
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from(NameOfStorage)
        .download(path);

      if (error) {
        console.log(error);
        setImage(fallback); // Set fallback if there's an error
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
      setLoading(false);
    };

    fetchImage();
  }, [path]);

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large"  />
      ) : (
        <Image source={{ uri: image || fallback }} {...imageProps} />
      )}
    </View>
  );
};

export default RemoteImage;
