#https://www.codewars.com/kata/ link
require_relative 'kata-test-framework-ruby/framework_console.rb'

=begin
Okja is so smart, she can find the shortest path to a parsimon.

Given a map, plot the shortest path Okja must run to the parsimon.
A map value of -1 is the border
A low map value is easy to traverse, 0 is flat ground
Map1: terrain
 1-3 flat ground - light bushes - shallow water
 4-6 uneven ground -underbrush - rocky water
 7-9 rocky ground - trees - deep water
map2: elevation


=end

class Node
  attr_accessor :gCost, :eDistCost, :x, :y, :parent_node, :goal_node

  def initialize(parent, goal, gCost = 0, x = 0, y = 0)
    @parent_node = parent if parent != nil
    @goal_node = goal if goal != nil
    @gCost = gCost
    @eDistCost = 0
    @x = x
    @y = y
    init_node
  end


  def init_node
    if @parent_node != nil then
      @gCost = @parent_node.gCost + @gCost
    end

    if @goal_node != nil then
      @eDistCost = euclidean_distance
    else
      @eDistCost = 0
    end
  end


  def total_cost
    return @gCost + @eDistCost
  end


  def euclidean_distance
    xd = @x - @goal_node.x
    yd = @y - @goal_node.y
    return ((xd*xd) + (yd*yd))**0.5
  end


  def compare_to(node)
    return (@gCost + @eDistCost) - node.total_cost
  end


  def matches(node)
    if node != nil then
      if (@x == node.x && @y == node.y) then
        return true
      else
        return false
      end
    else
      return false
    end
  end


  def get_successors
    successors = []
    for xd in -1..1 do
      for yd in -1..1 do
        if $gameboard.get_map(@x+xd, @y+yd) != -1
          node = Node.new(self, @goal_node, $gameboard.get_map(@x+xd, @y+yd), @x+xd, @y+yd)
          if node.matches(@parent_node) == false && self.matches(node) == false then
            successors.push(node)
          end
        end
      end
    end
    return successors
  end
end


def get_map(x,y)
  if x < 0 || x > $gameboard[0].length - 1 then
    return -1 #out of bounds
  end

  if y < 0 || y > $gameboard.length - 1 then
    return -1 #out of bounds
  end

  return $gameboard[y][x]
end


def printmap(map = $gameboard, path = [])
  xMax = $gameboard[0].length - 1
  yMax = $gameboard.length - 1
  myresult = ""

  for j in 0..yMax do
    for i in 0..yMax do
      solution_node = 0
      path.each_with_index do |node, a|
        tmp = Node.new(nil, nil, 0, i, j)

        if node.matches(tmp) then
          solution_node = a
          break
        end
      end

      if solution_node > 0 then
        myresult += "o "
      else
        if $gameboard.get_map(i,j) == -1 then
          myresult += "X "
        else
          myresult += ". "
        end
      end

    end
    myresult += "\n"
  end

  puts myresult
  puts "path is #{solution_path_list.count} steps long!"
end



def runOkja(map, startx, starty, parsimonx, parsimony)

return path
end




#Testing

1 uneven ground
2 hill/undergrowth
3 is dense undergrowth
4 trees
5 is dense trees
6 a rocky river
7 waterfall, very rocky river segment
8 deep water
9 a cliff

data = [
  [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3],
  [ 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 6],
  [ 0, 0, 0, 0, 0, 0, 1, 2, 3, 6, 3],
  [ 0, 0, 0, 0, 0, 0, 1, 3, 6, 6, 3],
  [ 0, 0, 0, 0, 0, 0, 3, 8, 8, 6, 3],
  [ 0, 6, 7, 8, 3, 0, 8, 5, 3, 3, 3],
  [ 8, 6, 8, 8, 8, 0, 5, 5, 0, 0, 0],
  [ 0, 6, 7, 8, 3, 0, 0, 0, 0, 0, 0],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
describe "Run Okja!" do
  Test.assert_equals(translate("foo"), "")
  Test.assert_equals(translate(0), "")
end
