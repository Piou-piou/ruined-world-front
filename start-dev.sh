rm -rf dist
npm install
npm run generate
cat assets/game_infos.json | grep app_version