package ejecucion;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public final class DateUtils {    

    public static final String DB_FORMAT_DATETIME = "yyyy-MM-dd HH:mm:ss";        

    private DateUtils() {
        // not publicly instantiable
    }       

    public static Date getDate(String dateStr) {
    	
    	String[] parts = dateStr.split("T");
    	
        final DateFormat formatter = new SimpleDateFormat(DB_FORMAT_DATETIME);
        try {
            return formatter.parse(parts[0] + " 00:00:00");
        } catch (ParseException e) {                
            return null;
        }
    }
    
    
    public static Date[] getDates(String dateStr) {
    	
    	String[] parts = dateStr.split("T");
    	Date[] vector = new Date[2];
    	
        final DateFormat formatter = new SimpleDateFormat(DB_FORMAT_DATETIME);
        try {
            vector[0] = formatter.parse(parts[0] + " 00:00:00");
            vector[1] = formatter.parse(parts[0] + " 23:59:59");
            return vector;
        } catch (ParseException e) {                
            return null;
        }
    }
} 
