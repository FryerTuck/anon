<?
namespace Anon;




# tool :: file_plug : embedded database abstraction
# ---------------------------------------------------------------------------------------------------------------------------------------------
   class file_plug
   {
      public $mean=null;
      public $link=null;
      public $fail=null;
      public $cols=['repo','path','name','mime','type','size','time','mode','levl','data'];



      function __construct($x)
      {
      }



      function __destruct()
      {
         $this->pacify();
      }



      function __call($n,$a)
      {
         return call($this->$n,$a);
      }



      function vivify()
      {
         if($this->link){return $this->link;};
      }



      function pacify()
      {
         if($this->link){$this->link->close(); $this->link=null; return true;};
      }



      function exists($f=null)
      {
      }



      function select($a)
      {
      }



      function update($a)
      {
      }



      function insert($a)
      {
      }



      function rename($a)
      {
      }



      function delete($a)
      {
      }
   }
# ---------------------------------------------------------------------------------------------------------------------------------------------
