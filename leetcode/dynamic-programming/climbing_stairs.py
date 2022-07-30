# https://leetcode.com/problems/climbing-stairs/description/


class Solution:
    def climbStairs(self, n: int) -> int:
      while n:
        a = n - 1
        b = n - 2

    def basic(self, n, count = 0):
      if n == 1:
        return count + 1
      elif n == 2:
        return count + 2

solution = Solution()

assert solution.climbStairs(2) == 2
assert solution.climbStairs(3) == 3
