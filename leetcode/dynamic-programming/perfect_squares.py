# https://leetcode.com/problems/perfect-squares/

class Solution:
    def numSquares(self, n: int) -> int:
        squares = [i**2 for i in range(1, int(n**0.5)+1)]
        depth, q, nq = 1, {n}, set()
        while q:
            for node in q:
                for square in squares:
                    if node == square:
                        return depth
                    if node < square:
                        break
                    nq.add(node-square)
            q, nq, depth = nq, set(), depth+1


solution = Solution()
assert solution.numSquares(12) == 3  # 4 + 4 + $
assert solution.numSquares(13) == 2  # 4 + 9
