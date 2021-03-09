def smallest_integer(array)
    smallest=array[0]
    array.each_with_index {|value, index|
        if value < smallest
            smallest=value
        end
        
    }

    puts smallest
end

smallest_integer([34, -345, -1, 100])