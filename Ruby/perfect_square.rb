
def perfect_square(num)
    return_val="false"
    for a in 0..num
        if num==0
            return_val="true"
        end
        if a*a == num
            return_val="true"
        end
    
    end
    puts return_val
end

puts perfect_square(25)