import heapq

# Small network graph (A, B, C, D) with distances
GRAPH = {
    "A": {"B": 5, "C": 10},
    "B": {"A": 5, "D": 9, "C": 3},
    "C": {"A": 10, "B": 3, "D": 4},
    "D": {"B": 9, "C": 4},
}


def get_best_route(start: str, end: str) -> list[str]:
    if start not in GRAPH or end not in GRAPH:
        return []

    distances = {node: float("inf") for node in GRAPH}
    distances[start] = 0
    priority_queue = [(0, start)]
    previous_nodes = {node: None for node in GRAPH}

    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)

        if current_distance > distances[current_node]:
            continue

        if current_node == end:
            break

        for neighbor, weight in GRAPH[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous_nodes[neighbor] = current_node
                heapq.heappush(priority_queue, (distance, neighbor))

    if distances[end] == float("inf"):
        return []

    route = [end]
    node = end
    while previous_nodes[node] is not None:
        node = previous_nodes[node]
        route.append(node)
    route.reverse()
    return route
