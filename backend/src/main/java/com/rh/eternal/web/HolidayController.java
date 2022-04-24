package com.rh.eternal.web;

import com.rh.eternal.db.entity.HolidayEntity;
import com.rh.eternal.db.repository.HolidayRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping("holiday")
public class HolidayController {
  private final HolidayRepository repository;

  public HolidayController(HolidayRepository repository) {
    this.repository = repository;
  }

  @GetMapping("")
  public List<HolidayEntity> findAll() {
    return this.repository.findAll();
  }

  @PostMapping("/favourite/{id}")
  public void addFavourite(@PathVariable("id") Long holidayId) throws InterruptedException {
    Thread.sleep(1000);
  }

  @DeleteMapping("/favourite/{id}")
  public void removeFavourite(@PathVariable("id") Long holidayId) throws InterruptedException {
    Thread.sleep(1000);
  }
}
