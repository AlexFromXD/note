# https://leetcode.com/problems/sum-of-two-integers/


class Solution:
    def getSum(self, a: int, b: int) -> int:
        while b:
            a = a ^ b
            carry = a & b
            b = carry << 1
        return a


solution = Solution()
assert solution.getSum(1, 2) == 3
assert solution.getSum(2, 3) == 5
