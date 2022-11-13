# https://leetcode.com/problems/perfect-squares/

from typing import List


class Solution:
    def get_squares_lt(self, n: int) -> List[int]:
        return [i**2 for i in range(1, int(n**0.5)+1)]

    def numSquares(self, n: int) -> int:
        squares = self.get_squares_lt(n)
        depth = 1
        queue = {n}
        next_queue = set()
        while queue:
            for node in queue:
                for square in squares:
                    if node == square:
                        return depth
                    elif node < square:
                        break
                    next_queue.add(node-square)
            queue = next_queue
            next_queue = set()
            depth += 1


solution = Solution()
assert solution.numSquares(12) == 3  # 4 + 4 + 4
assert solution.numSquares(13) == 2  # 4 + 9
