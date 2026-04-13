name: Update views.json from Yandex Metrika

on:
  workflow_dispatch:
  schedule:
    - cron: "*/30 * * * *"

permissions:
  contents: write

jobs:
  update-views:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Update views.json
        env:
          YANDEX_TOKEN: ${{ secrets.YANDEX_TOKEN }}
          YANDEX_COUNTER_ID: ${{ secrets.YANDEX_COUNTER_ID }}
        run: node scripts/update-views.js

      - name: Commit changes
        run: |
          if git diff --quiet views.json; then
            echo "No changes"
            exit 0
          fi
          git add views.json
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git commit -m "Update views.json from Yandex Metrika"
          git push
