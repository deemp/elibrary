from elibrary.website import create_app

app = create_app()

def run():
    app.run(debug=True)
    
if __name__ == "__main__":
    run()