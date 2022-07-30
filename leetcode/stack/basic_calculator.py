# https://leetcode.com/problems/basic-calculator/


class Solution:

    def calculate(self, s: str) -> int:

        # temp_res & res
        res = 0
        # num's sign
        sign = 1
        # calculate num
        num = 0

        stack = []

        for i in range(len(s)):
            # 1. digit (just for calculation)
            if s[i].isdigit():
                num = num*10 + int(s[i])
            # 2.( push
            elif s[i] == '(':
                stack.append(res)
                stack.append(sign)

                # reset res & sign
                res = 0
                sign = 1

            # 3. ) pop
            elif s[i] == ')':
                res += num*sign
                # pop sign first
                res *= stack.pop()
                # then pop num
                res += stack.pop()
                # reset num
                num = 0

            # 4. & 5.: + , -
            elif s[i] in '-+':
                res += num*sign
                sign = -1 if s[i] == '-' else 1
                # res num
                num = 0

        # for situation1, we did't add the current res and num stored in memory, so add it here
        res += num*sign

        return res


solution = Solution()

assert solution.calculate("1 + 1") == 2
assert solution.calculate("2-1 + 2") == 3
assert solution.calculate("(1+(4+5+2)-3)+(6+8)") == 23
assert solution.calculate("(2 + 3) + 1 + 2") == 8
assert solution.calculate("(2 + 3) - ()") == 8
