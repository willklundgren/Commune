# Betterplay
Betterplay is a web application for commenting on your collaborative Spotify playlists. Based on repeated user requests on Spotify's community forum since at least 2012 - see [here](https://community.spotify.com/t5/Live-Ideas/All-Platforms-Social-Send-comments-in-Collaborative-Playlists/idi-p/4900980) for an illustrative post from early 2020 - it is clear that the Spotify community wants a commenting feature built into their collaborative playlists so the music sharing experience can be more interactive and social. Betterplay responds to this need by offering a straightforward way to comment on existing collaborative playlists as one might on Facebook or LinkedIn - see the screenshot below (the playlist title and usernames are redacted).

To get started, simply follow this [link](http://52.246.250.124:3223), sign in to your existing Spotify account via secure authorization, and select a playlist. Note that the application works best in a desktop / non-mobile browser; for the best viewing experience on iOS devices, be sure to switch to landscape mode. Disclaimer: **as of 5/2020, intra-site traffic isn't encrypted, so comments on songs cannot be guaranteed to be safe from third parties.** Note that this does not apply to authorization-related information requested upon login, which follows OAuth2 best practices.

![Betterplay playlist page](/images/bp_screenshot_2_cropped_and_blacked_out.jpg)

## Tools Used
- React (bootstrapped with [Create React App](https://github.com/facebook/create-react-app))
    - React Router for frontend routing
- NodeJS
    - Axios for HTTP requests
- Microsoft Azure
    - Virtual Machine (Ubuntu)
    - Cosmos DB (for a MongoDB database)
- Express server framework

## Next Steps (as of 5/20)
- Implement HTTPS-compliant encryption
- Add additional fields to playlist, e.g. song rating out of 5, contributor, etc
- Improve styling - more color, animations, etc
- Containerize the application with Docker

## Acknowledgements
- Thank you to Spotify's engineering team for the authorization-related sample code, which can be found [here](https://github.com/spotify/web-api-auth-examples).