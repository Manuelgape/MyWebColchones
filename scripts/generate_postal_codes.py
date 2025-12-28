import json
from pathlib import Path


def generate_codes(prefix: int) -> list[str]:
    start = prefix * 1000
    end = start + 1000
    return [f"{code:05d}" for code in range(start, end)]


def main() -> None:
    codes = sorted(generate_codes(37) + generate_codes(49))
    output = Path(__file__).resolve().parents[1] / "data" / "postal_codes.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(codes, indent=2), encoding="ascii")


if __name__ == "__main__":
    main()
