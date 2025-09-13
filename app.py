from flask import Flask, render_template, redirect, url_for

# Flaskアプリケーションを作成
app = Flask(__name__)

# ★重要：JSゲーム（マップ画面）のURLをここに設定
# VS CodeのLive Serverを使っている場合、通常はこのアドレスです
MAP_GAME_URL = "http://127.0.0.1:5500/index.html" 

# --- ミニゲームのルート ---
# 'http://127.0.0.1:5000/dazaifu-game' にアクセスされたときの処理
@app.route('/dazaifu-game')
def dazaifu_game():
    # 'templates'フォルダの中の'game.html'を表示する
    # ここにミニゲームのロジックを実装していく
    return render_template('game.html')

# 門司港ゲーム用のルートを新しく追加
@app.route('/mojiko-game')
def mojiko_game():
    return render_template('mojiko_game.html')

# 福岡タワーゲーム用のルートを新しく追加
@app.route('/tower-game')
def tower_game():
    return render_template('tower_game.html')


# --- ゲームクリア時の処理 ---
# 'http://127.0.0.1:5000/game-clear/umegaemochi' にアクセスされたときの処理
@app.route('/game-clear/<item_name>')
def game_clear(item_name):
    # 報酬アイテム付きのURLにリダイレクト（自動転送）する
    # 例： "http://127.0.0.1:5500/index.html?reward=梅ヶ枝餅"
    reward_url = f"{MAP_GAME_URL}?reward={item_name}"
    return redirect(reward_url)

# --- Pythonスクリプトとして直接実行されたときにサーバーを起動 ---
if __name__ == '__main__':
    # デバッグモードでサーバーを起動（開発中に便利）
    app.run(debug=True, port=5000)