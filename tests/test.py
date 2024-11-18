from pathlib import Path

f = Path(__file__).parent / "test.txt"
_ = f.write_text("It's me!\n")