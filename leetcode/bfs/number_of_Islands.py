# https://leetcode.com/problems/number-of-islands/
from collections import deque
from typing import List


class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid:
            return 0

        m = len(grid)
        n = len(grid[0])
        ans = 0

        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    q = deque([(i, j)])
                    # marked as already visited
                    grid[i][j] = '2'
                    while q:
                        x, y = q.popleft()
                        # check up, down, right and left
                        for dx, dy in (0, 1), (0, -1), (1, 0), (-1, 0):
                            xx = x + dx
                            yy = y + dy
                            if 0 <= xx < m and \
                                0 <= yy < n and \
                                    grid[xx][yy] == '1':
                                q.append((xx, yy))
                                grid[xx][yy] = '2'
                    ans += 1
        return ans


solution = Solution()

assert solution.numIslands([
    ["1", "1", "1", "1", "0"],
    ["1", "1", "0", "1", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "0", "0", "0"]
]) == 1

assert solution.numIslands([
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"]
]) == 3

assert solution.numIslands([
    ["1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1"]
]) == 1

assert solution.numIslands([
    ["0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0"]
]) == 0

print("=== pass ===")
