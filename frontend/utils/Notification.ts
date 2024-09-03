import { supabase } from "@/lib/supabase";

export async function sendLikeNotification(like) {
    const { data } = await supabase
      .from('likesPost')
      .select('*, posts(*, users(*))')
      .eq('id', like.id)
      .single();
  
    const pushToken = data?.posts?.users?.push_token;
    if (!pushToken) {
      return;
    }
  
    const message = {
      to: pushToken,
      sound: 'default',
      title: 'Someone liked your post',
      body: `${data?.posts?.users.username} liked your post!`,
      data: { postId: data.posts.id },
    };
    sendPushNotification(message);
  }
  
  async function sendPushNotification(message) {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }