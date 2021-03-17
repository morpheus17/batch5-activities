def getCenturyFromYear(y)
    
     if (y % 100) == 0
       y/100
     else 
       (y - (y % 100))/100 + 1
     end
  end

  puts getCenturyFromYear(1905)