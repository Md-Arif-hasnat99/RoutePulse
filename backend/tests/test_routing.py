from app.services.routing import get_best_route


def test_best_route_from_a_to_d() -> None:
    assert get_best_route("A", "D") == ["A", "B", "C", "D"]


def test_empty_route_for_unknown_node() -> None:
    assert get_best_route("X", "D") == []
