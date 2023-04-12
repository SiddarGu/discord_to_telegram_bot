import requests
channel_names = ['supertf']

for channel_name in channel_names:
    contents = requests.get('https://www.twitch.tv/' + channel_name).content.decode('utf-8')

    if 'isLiveBroadcast' in contents: 
        print(channel_name + ' is live')
    else:
        print(channel_name + ' is not live')